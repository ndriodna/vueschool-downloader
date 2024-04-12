import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { checkExist } from "../helper/helper.js";

export default async function (lesson) {
  const outputPath = "./output";
  const batchPath = "batch.txt";
  const listPath = [];
  for (let i = 0; i < lesson.length; i++) {
    const slugTitle = lesson[i].title.replace(/[ *]/g, "-");
    const pathFile = `${outputPath}/${slugTitle}`;
    await mkdir(pathFile, { recursive: true });
    if (checkExist(pathFile)) {
      await writeFile(
        `${pathFile}/${batchPath}`,
        String(lesson[i].urls).replace(/[,]/g, "\n")
      );
      listPath.push(pathFile);
    }
  }
  for (let i = 0; i < listPath.length; i++) {
    if (checkExist(`${listPath[i]}/${batchPath}`)) {
      execFile(
        "yt-dlp.exe",
        [
          "--refer https://vueschool.io/",
          `-a ${listPath[i]}/${batchPath}`,
          `-P ${listPath[i]}`,
        ],
        (error, stdout) => {
          if (error) {
            throw error;
          }
          console.log(stdout);
        }
      );
    }
  }
}
