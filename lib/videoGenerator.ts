import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import path from "path";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegPath.path);

// ✅ Fix: Function accepts an ARRAY of paths
export async function generatePromoVideo(
  imagePaths: string[], 
  outputName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(process.cwd(), "public/videos");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, outputName);
    
    // ✅ Windows-Safe Fix: Create a list file
    const tempDir = path.dirname(imagePaths[0]); 
    const listFilePath = path.join(tempDir, `list_${Date.now()}.txt`);

    const fileContent = imagePaths
      .map((p) => `file '${p.replace(/\\/g, "/")}'\nduration 2`)
      .join("\n");

    const lastPath = imagePaths[imagePaths.length - 1].replace(/\\/g, "/");
    const finalContent = `${fileContent}\nfile '${lastPath}'`;

    fs.writeFileSync(listFilePath, finalContent);

    ffmpeg(listFilePath)
      .inputOptions(["-f concat", "-safe 0"])
      .outputOptions([
        "-pix_fmt yuv420p",
        "-c:v libx264",
        "-r 30",
      ])
      .save(outputPath)
      .on("end", () => {
        try { fs.unlinkSync(listFilePath); } catch (e) {}
        resolve(`/videos/${outputName}`);
      })
      .on("error", (err: Error) => {
        console.error("FFmpeg Error:", err);
        reject(err);
      });
  });
}