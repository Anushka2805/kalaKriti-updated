import { NextRequest, NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath.path);

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const files = data.getAll("images") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    // 1. Setup Directories
    const tempDir = path.join(process.cwd(), "tmp");
    const outputDir = path.join(process.cwd(), "public/videos");

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // 2. Save Images to Disk
    const imagePaths: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const buffer = Buffer.from(await files[i].arrayBuffer());
      const filePath = path.join(tempDir, `img_${Date.now()}_${i}.jpg`);
      fs.writeFileSync(filePath, buffer);
      imagePaths.push(filePath);
    }

    // 3. Create FFmpeg List File
    const listFilePath = path.join(tempDir, `list_${Date.now()}.txt`);
    const fileContent = imagePaths
      .map((p) => `file '${p.replace(/\\/g, "/")}'\nduration 2`)
      .join("\n");
      
    // Repeat the last image to ensure duration holds
    const lastPath = imagePaths[imagePaths.length - 1].replace(/\\/g, "/");
    fs.writeFileSync(listFilePath, `${fileContent}\nfile '${lastPath}'`);

    // 4. Generate Video with Robust Scaling
    const outputName = `promo_${Date.now()}.mp4`;
    const outputPath = path.join(outputDir, outputName);

    await new Promise((resolve, reject) => {
      ffmpeg(listFilePath)
        .inputOptions(["-f concat", "-safe 0"])
        .outputOptions([
          // ⬇️ THIS IS THE FIX: Force standard 1080x1080 scaling for ALL inputs
          "-vf", "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2",
          
          "-pix_fmt", "yuv420p", // Required for player compatibility
          "-c:v", "libx264",     // Standard encoding
          "-r", "30",            // Stable 30fps
        ])
        .save(outputPath)
        .on("end", resolve)
        .on("error", (err: Error) => {
          console.error("FFmpeg Error:", err.message);
          reject(err);
        });
    });

    // 5. Cleanup
    try {
      fs.unlinkSync(listFilePath);
      imagePaths.forEach((p) => fs.unlinkSync(p));
    } catch (e) {
      console.warn("Cleanup warning:", e);
    }

    return NextResponse.json({ videoUrl: `/videos/${outputName}` });

  } catch (error: any) {
    console.error("🔥 SERVER CRASH:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}