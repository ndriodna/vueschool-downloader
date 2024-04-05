import puppeteer from "puppeteer";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import cliInput from "./cli.js";
import dotenv from "dotenv";
dotenv.config();

const args = process.argv.slice(2);

const courses = [];

const coursesUrl = "https://vueschool.io/courses";

async function openBrowser() {
  const browser = await puppeteer.launch();
  return browser;
}

async function newPage(browser) {
  const page = await browser.newPage();
  return page;
}

async function getCourses(page) {
  if (!existsSync("./cookies.txt")) {
    await page.goto("https://vueschool.io/login");
    console.log("cookies not found trying login");
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
    getAuth = JSON.parse(getAuth);
    console.log("cookies found!");

    await page.setCookie(...getAuth);

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

  console.log(courses);
}

(async () => {
  const browser = await openBrowser();
  const page = await newPage(browser);
  await getCourses(page);
  await browser.close();
  cliInput(courses).then((e) => {
    console.log("selected: ", e);
  });
})();
