const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const dotenv=  require("dotenv");

dotenv.config({path: "./.env"});

const url = "https://www.bbc.co.uk/sport/football"

const scrape = async () => {
    const {data} = await axios.get(url);

    const info = {headline: "", description: ""};
    const $ = cheerio.load(data);
    const item = $("div#orb-modules");
    info.headline = $(item).find("a h3.gs-c-promo-heading__title").first().text();
    info.description = $(item).find("p").first().text();

    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
           user: process.env.EMAIL,
           pass: process.env.PASS
        }
    })

    const html = `
        <h1>BBC Sport</h1>
        <h3>${info.headline}</h3>
        <p>${info.description}</p>
    `

    const options = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: "Web Scraper Test",
        html,
    };

    transporter.sendMail(options, (err, info) => {
        if(err){
            return console.log(err);
        } else {
            console.log("sent: " + info.response);
        }
    })

}

scrape();