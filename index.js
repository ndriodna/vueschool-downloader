import puppeteer from 'puppeteer';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import dotenv from 'dotenv';
dotenv.config();

const args = process.argv.slice(2);

const courseUrl = 'https://vueschool.io/courses';

const browser = await puppeteer.launch();

const page = await browser.newPage();

if (!existsSync('./cookies.txt')) {
  await page.goto('https://vueschool.io/login');
  console.log('cookies not found trying login');
  const emailFill = await page.$('input[type="text"]');
  await emailFill.type(process.env.USER_ID);
  const passwordFill = await page.$('input[type="password"]');
  await passwordFill.type(process.env.USER_PASS);
  await passwordFill.press('Enter');
  await page.waitForNavigation();
  await page.goto('https://vueschool.io/profile/account');

  let authCookies = await page.cookies();
  authCookies = JSON.stringify(authCookies);
  writeFileSync('./cookies.txt', authCookies);
}

let getAuth = readFileSync('./cookies.txt');
getAuth = JSON.parse(getAuth);

await page.setCookie(...getAuth);

await page.goto(courseUrl);
const getEachCourse = await page.$$eval('a.thumb-card', (el) => {
  return el.map((e) => {
    const title = e.querySelector('h3.text-xl').innerText;
    const url = e.getAttribute('href');
    const regex = /\(\"(.*?)\"\)/;
    const findThumbnail = e
      .querySelector('div.thumbnail')
      .getAttribute('style')
      .match(regex);
    const thumbnail = findThumbnail ? findThumbnail[1] : '';
    return { title, url, thumbnail };
  });
});

console.log(getEachCourse);
await browser.close();
