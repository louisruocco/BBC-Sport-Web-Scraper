const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const dotenv=  require("dotenv");

dotenv.config({path: "./.env"});

const url = "https://www.bbc.co.uk/sport/football"

const scrape = async () => {
    const {data} = await axios.get(url);

    const mainHeadline = {headline: "", description: "", link: ""};
    const headline2 = {headline: ""};
    const headline3 = {headline: ""};
    const headline4 = {headline: ""};
    const headline5 = {headline: ""};
    const $ = cheerio.load(data);
    const item = $("div#orb-modules");
    
    mainHeadline.headline = $(item).find("a h3.gs-c-promo-heading__title")
        .first()
        .text();
    mainHeadline.description = $(item).find("p")
        .first()
        .text();
    mainHeadline.link = $(item).find("a.gs-c-promo-heading")
        .attr("href");

    headline2.headline = $(item).find("div.gel-layout__item:nth-child(2) a h3")
        .first()
        .text();
    headline3.headline = $(item).find("div.gel-layout__item:nth-child(3) a h3")
        .first()
        .text();
    headline4.headline = $(item).find("div.gel-layout__item:nth-child(4) a h3")
        .first()
        .text();
    headline5.headline = $(item).find("div.gel-layout__item:nth-child(5) a h3")
        .first()
        .text();

    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
           user: process.env.EMAIL,
           pass: process.env.PASS
        }
    })

    const html = `
        <h1>BBC Sport</h1>
        <h2>Top Story:</h2>
        <hr>
        <h3><a href=${mainHeadline.link}>${mainHeadline.headline}</a></h3>
        <p>${mainHeadline.description}</p>
        <h2>Other Stories:</h2>
        <hr>
        <ul>
            <li>${headline2.headline}</li>
            <li>${headline3.headline}</li>
            <li>${headline4.headline}</li>
            <li>${headline5.headline}</li>
        </ul>
    `

    const options = {
        from: process.env.EMAIL,
        to: "louisruocco1@gmail.com",
        subject: "BBC SPORT NEWS",
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