import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);

const courseUrl = 'https://vueschool.io/courses';

const browser = await puppeteer.launch({ headless: false });

const page = await browser.newPage();

await page.goto('https://vueschool.io/login');

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

let getAuth = readFileSync('./cookies.txt');
getAuth = JSON.parse(getAuth);
console.log(getAuth);
console.log('done');

// await browser.close();
