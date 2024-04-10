import { exec } from "node:child_process";
import { readFileSync } from "node:fs";

export default function (selected, courses) {
  const outputPath = "./output";
  const filePath = "./batch.txt";
  if (existsSync(filePath)) {
    const getBatch = readFileSync(filePath);
    exec(`'"./yt-dlp.exe", --refer https://vueschool.io/ -a ${getBatch}'`);
  }
}
