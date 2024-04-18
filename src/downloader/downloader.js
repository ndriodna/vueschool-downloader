import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { checkExist, clearScreen, colorText } from "../helper/helper.js";
import readline from "node:readline";

export default async function (videosLesson) {
  const outputPath = "output";
  const batchPath = "batch.txt";
  const listPath = [];
  for (let i = 0; i < videosLesson.length; i++) {
    const slugTitle = videosLesson[i].title.replace(/[ *]/g, "-");
    const pathFile = `${outputPath}/${slugTitle}`;
    await mkdir(pathFile, { recursive: true });
    if (checkExist(pathFile)) {
      await writeFile(
        `${pathFile}/${batchPath}`,
        String(videosLesson[i].videoUrls).replace(/[,]/g, "\n")
      );
      await writeFile(
        `${pathFile}/output.json`,
        JSON.stringify(videosLesson[i])
      );
      listPath.push(pathFile);
    }
  }
  for (let i = 0; i < listPath.length; i++) {
    if (checkExist(`${listPath[i]}/${batchPath}`)) {
      const childProcess = execFile("./downloader/yt-dlp.exe", [
        "--refer",
        "https://vueschool.io/",
        "--batch-file",
        `${listPath[i]}/${batchPath}`,
        "--paths",
        listPath[i],
      ]);
      childProcess.stdout.on("data", (data) => {
        clearScreen(readline);
        console.log("log: ", data);
      });
      childProcess.stderr.on("data", (data) => {
        console.log(colorText(1, "log Err: " + data));
      });
      childProcess.on("error", (err) => {
        console.log(colorText(1, "Exec Error: " + err));
      });
    }
  }
}
