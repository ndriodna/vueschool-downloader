import { execFile } from "node:child_process";
import { checkExist, clearScreen, colorText } from "../helper/helper.js";
import readline from "node:readline";

const batchPath = "batch.txt";
export default function downloader(listPath) {
  for (let i = 0; i < listPath.length; i++) {
    if (checkExist(`${listPath[i]}/${batchPath}`)) {
      const childProcess = execFile("./downloader/yt-dlp.exe", [
        "--refer",
        "https://vueschool.io/",
        "--batch-file",
        `./${listPath[i]}/${batchPath}`,
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