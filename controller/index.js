const fetch = require("node-fetch");
const puppeteer = require("puppeteer");
const fs = require("node:fs/promises");
const { v4: uuidv4 } = require("uuid");
const { WEBSITE_URL } = require("../config");

exports.parseURL = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto(WEBSITE_URL, {
      waitUntil: "domcontentloaded",
    });
    const button = await page.$("#cookie-allow-all");
    await button.click();
    let titles = await page.$$eval("#s2 h3 a", (elements) => {
      return elements.map((element) => element.innerHTML);
    });
    const links = await page.$$eval(".pdf", (elements) =>
      elements.map((element) => element.getAttribute("href")),
    );
    let dates = await page.$$eval("#s2 p", (elements) => {
      return elements.map((element) => {
        let start = element
          .querySelector("time:nth-child(1)")
          .getAttribute("datetime");
        let end = element
          .querySelector("time:nth-child(2)")
          .getAttribute("datetime");
        return {
          start: start,
          end: end,
        };
      });
    });
    await browser.close();
    const result = titles.map((element, index) => {
      return {
        title: element,
        start: new Date(dates[index].start),
        end: new Date(dates[index].end),
        link: links[index],
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).send("Something broke!");
    console.error(err);
  }
};

exports.downloadCatalogs = async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto(WEBSITE_URL, {
      waitUntil: "domcontentloaded",
    });
    const button = await page.$("#cookie-allow-all");
    await button.click();
    const catalogsUrlArray = await page.$$eval(".pdf", (elements) =>
      elements.map((element) => element.getAttribute("href")),
    );
    catalogsUrlArray.forEach(async (url) => {
      const response = await fetch(url);
      const buffer = await response.buffer();
      await fs.writeFile(`public/catalogs/download${uuidv4()}.pdf`, buffer);
    });

    res.send("Files downloaded to your_project_folder/public/catalogs");
  } catch (err) {
    res.status(500).send("Something broke!");
    console.error(err);
  }
};
