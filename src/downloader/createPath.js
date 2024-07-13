import { mkdir, writeFile } from "node:fs/promises";
import { checkExist } from "../helper/helper.js";

const batchPath = "batch.txt";
export default async function (videosLesson) {
    const outputPath = "./src/output";
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
    return listPath
}