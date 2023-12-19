/// <reference types="puppeteer" />
import puppeteer from "puppeteer";
import { parseCsvFile } from "./utils/helpers/CsvToJson";

interface User {
  link: string;
  name: string;
}

async function fileToJson(): Promise<User[]> {
  const usersJson = await parseCsvFile("src/users.txt");
  return usersJson;
}

const targetDivClass = "profile_ban_status";
const backupNameDivClass = "actual_persona_name";

async function scrapeWebsite(browser: any): Promise<void> {
  const users = await fileToJson();

  const userPromises = users.map(async (user) => {
    const page = await browser.newPage();
    let divContent: string = "";
    let backupName: string = "";

    try {
      await page.goto(user.link, {
        timeout: 10000,
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector(`.${targetDivClass}`, { timeout: 1000 }); // Adjust timeout as needed
      divContent = await page.$eval(
        `.${targetDivClass}`,
        (div: any) => div?.textContent || ""
      );
      await page.waitForSelector(`.${backupNameDivClass}`, { timeout: 1000 }); // Adjust timeout as needed
      backupName = await page.$eval(
        `.${backupNameDivClass}`,
        (div: any) => div?.textContent || ""
      );
    } catch (error) {
      divContent = "Tzl não está banido";
    } finally {
      await page.close();
    }

    if (!user.name) user.name = backupName;
    console.log(`Retardado: ${user.name}:`, divContent);
  });

  await Promise.all(userPromises);
}

(async () => {
  const browser = await puppeteer.launch();

  try {
    await scrapeWebsite(browser);
  } finally {
    await browser.close();
  }
})();
