const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");

const url = "https://www.bbc.co.uk/sport/football"

const scrape = async () => {
    const {data} = await axios.get(url);

    const info = {headline: "", description: ""};
    const $ = cheerio.load(data);
    const item = $("div#orb-modules");
    info.headline = $(item).find("h3").first().text();
    info.description = $(item).find("p").first().text();
    console.log(`Headline: ${info.headline}, Description: ${info.description}`);
}

scrape();