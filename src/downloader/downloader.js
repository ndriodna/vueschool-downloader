import { exec } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { checkExist } from "../helper/helper.js";

export default async function (lesson) {
  const outputPath = "./output";
  const batchPath = "batch.txt";
  for (let i = 0; i < lesson.length; i++) {
    const slugTitle = lesson[i].title.replace(/[ *]/g, "-");
    await mkdir(`${outputPath}/${slugTitle}`, { recursive: true });
    if (checkExist(`${outputPath}/${slugTitle}`)) {
      await writeFile(
        `${outputPath}/${slugTitle}/${batchPath}`,
        String(lesson[i].urls)
      );
    }
  }
  // if (existsSync(batchPath)) {
  //   const getBatch = readFileSync(batchPath);
  //   exec(`'"./yt-dlp.exe", --refer https://vueschool.io/ -a ${getBatch}'`);
  // }
}
