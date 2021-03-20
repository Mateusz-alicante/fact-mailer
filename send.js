const nodemailer = require("nodemailer");
const email = require('../fact-mailer/Templates/main')
const moment = require('moment');
const { default: axios } = require("axios");
require('dotenv').config()

const to = process.env.TO.split(',').map(str => str.split("="))
console.log(to)


const send = async () => {
    let [nameRAW, factRAW] = await Promise.all([axios.get("http://names.drycodes.com/1"), axios.get("https://uselessfacts.jsph.pl/today.json?language=en")]);
    console.log(nameRAW.data[0], factRAW.data.text)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS
        }
    });
    
    const mailData = {
        date: moment().format("dddd, MMMM Do YYYY"),
        fact: factRAW.data.text
    }

    const mail = email(mailData)

    to.forEach(async person => {
        let info = await transporter.sendMail({
            from: `"${nameRAW.data[0]}" `, // sender address
            to: person[1], // list of receivers
            subject: `Hello ${person[0]}!, it already is ${moment().format("dddd")}`, // Subject line
            html: mail, // html body
        });
        console.log(info)
    })
}

send()

