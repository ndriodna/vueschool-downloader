import puppeteer from "puppeteer";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import cliInput from "./cli.js";
import dotenv from "dotenv";
import downloader from "./downloader/downloader.js";
import createPath from "./downloader/createPath.js";
dotenv.config();

const courses = [];
let cookies = null;

const coursesUrl = "https://vueschool.io/courses";

async function openBrowser() {
  const browser = await puppeteer.launch();
  return browser;
}

async function newPage(browser) {
  const page = await browser.newPage();
  return page;
}

async function auth(page) {
  if (!existsSync("./cookies.txt")) {
    await page.goto("https://vueschool.io/login");
    console.log("cookies not found trying to login");
    const emailFill = await page.$('input[type="text"]');
    await emailFill.type(process.env.USER_ID);
    const passwordFill = await page.$('input[type="password"]');
    await passwordFill.type(process.env.USER_PASS);
    await passwordFill.press("Enter");
    await page.waitForNavigation();
    await page.goto("https://vueschool.io/profile/account");

    let authCookies = await page.cookies();
    authCookies = JSON.stringify(authCookies);
    writeFileSync("./cookies.txt", authCookies);
  } else {
    let getAuth = readFileSync("./cookies.txt");
    cookies = JSON.parse(getAuth);
    console.log("cookies found!");
  }
}

async function getCourses(page) {
  await page.setCookie(...cookies);

  await page.goto(coursesUrl, { waitUntil: "networkidle2" });
  const getEachCourse = await page.$$eval("a.thumb-card", (el) => {
    return el.map((e, i) => {
      const title = e.querySelector("h3.text-xl").innerText;
      const url = e.getAttribute("href");
      const regex = /\(\"(.*?)\"\)/;
      const findThumbnail = e
        .querySelector("div.thumbnail")
        .getAttribute("style")
        .match(regex);
      const thumbnail = findThumbnail ? findThumbnail[1] : "";
      return { id: i, title, url, thumbnail, checked: false };
    });
  });
  courses.push(...getEachCourse);
}

async function getEachLesson(browser, courses, selected) {
  const selectedCourses = courses.filter((e) => selected.includes(e.id));

  for (let i = 0; i < selectedCourses.length; i++) {
    const page = await newPage(browser);
    console.log("waiting for: ", selectedCourses[i].url);
    await page.goto(selectedCourses[i].url, { waitUntil: "networkidle2" });
    console.log("get url from: ", selectedCourses[i].url);
    const lessonUrl = await page.$$eval("a.title", (el) =>
      el.map((e, i) => {
        return e.getAttribute("href");
      })
    );
    Object.assign(selectedCourses[i], { urls: lessonUrl.slice() });
  }
  return selectedCourses;
}

async function getEachVideoLesson(browser, lessons) {
  const videoLesson = [];
  for (let i = 0; i < lessons.length; i++) {
    const videoUrls = [];
    for (let j = 0; j < lessons[i].urls.length; j++) {
      const batch = lessons[i].urls.slice(j, j + 3)
      const batchCourses = await Promise.all(batch.map(async (url) => {
        try {
          const page = await newPage(browser);
          console.log("waiting for scraping video from: ", url);
          await page.goto(url, { waitUntil: "networkidle2" });
          console.log("get url video from: ", url);
          const video = await page.$eval("iframe", (e) => e.getAttribute("src"));
          return video
        } catch (error) {
          console.log(error)
          return null
        }
      }))
      videoUrls.push(batchCourses)
    }
    const newLesson = { ...lessons[i] };
    newLesson.videoUrls = videoUrls;
    videoLesson.push(newLesson);
  }
  return videoLesson;
}

(async () => {
  const browser = await openBrowser();
  const page = await newPage(browser);
  await auth(page);
  await getCourses(page);
  const selected = await cliInput(courses);
  const lesson = await getEachLesson(browser, courses, selected);
  const videoLesson = await getEachVideoLesson(browser, lesson);
  await browser.close();
  const folderPath = await createPath(videoLesson)
  const downloadResult = downloader(folderPath);
  console.log(downloadResult);
})();
