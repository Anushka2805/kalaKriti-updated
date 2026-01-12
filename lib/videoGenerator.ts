import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import path from "path";
import fs from "fs";

ffmpeg.setFfmpegPath(ffmpegPath.path);

interface VideoOptions {
  imagePath: string;
  caption: string;
  outputName: string;
}

export async function generatePromoVideo({
  imagePath,
  caption,
  outputName,
}: VideoOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(process.cwd(), "public/videos");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, outputName);

    ffmpeg()
      .input(imagePath)
      .loop(6)
      .videoFilters([
        {
          filter: "zoompan",
          options: "z='min(zoom+0.0005,1.1)':d=180",
        },
        {
          filter: "drawtext",
          options: {
            text: caption,
            fontsize: 36,
            fontcolor: "white",
            x: "(w-text_w)/2",
            y: "h-120",
            box: 1,
            boxcolor: "black@0.6",
          },
        },
      ])
      .size("1080x1080")
      .outputOptions([
        "-pix_fmt yuv420p",
        "-movflags +faststart",
      ])
      .output(outputPath)
      .on("end", () => resolve(`/videos/${outputName}`))
      .on("error", (err) => reject(err))
      .run();
  });
}
