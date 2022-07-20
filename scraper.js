const axios = require("axios");
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const dotenv=  require("dotenv");

dotenv.config({path: "./.env"});

const url = "https://www.bbc.co.uk/sport/football"

const sevenAM = schedule.scheduleJob({hour: 7, minute: 0}, async () => {
    console.log("9am working");
})

const scrape = async () => {
    const {data} = await axios.get(url);

    const mainHeadline = {headline: "", description: "", link: ""};
    const headline2 = {headline: "", link: ""};
    const headline3 = {headline: "", link: ""};
    const headline4 = {headline: "", link: ""};
    const headline5 = {headline: "", link: ""};
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
    headline2.link = $(item).find("div.gel-layout__item:nth-child(2) a")
        .attr("href")
        
    headline3.headline = $(item).find("div.gel-layout__item:nth-child(3) a h3")
        .first()
        .text();
    headline3.link = $(item).find("div.gel-layout__item:nth-child(3) a")
        .attr("href")

    headline4.headline = $(item).find("div.gel-layout__item:nth-child(4) a h3")
        .first()
        .text();
    headline4.link = $(item).find("div.gel-layout__item:nth-child(4) a")
        .attr("href")

    headline5.headline = $(item).find("div.gel-layout__item:nth-child(5) a h3")
        .first()
        .text();
    headline5.link = $(item).find("div.gel-layout__item:nth-child(5) a")
        .attr("href")

    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
           user: process.env.EMAIL,
           pass: process.env.PASS
        }
    })

    const html = `
        <h1>Sports News:</h1>
        <h2>Top Story:</h2>
        <hr>
        <h3><a href=https://bbc.com/${mainHeadline.link}>${mainHeadline.headline}</a></h3>
        <p>${mainHeadline.description}</p>
        <h2>Other Stories:</h2>
        <hr>
        <ul>
            <li><a href="https://bbc.com/${headline2.link}">${headline2.headline}</a></li>
            <li><a href="https://bbc.com/${headline3.link}">${headline3.headline}</a></li>
            <li><a href="https://bbc.com/${headline4.link}">${headline4.headline}</a></li>
            <li><a href="https://bbc.com/${headline5.link}">${headline5.headline}</a></li>
        </ul>
    `

    const options = {
        from: process.env.EMAIL,
        to: "louisruocco1@gmail.com",
        subject: `SPORTS NEWS`,
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