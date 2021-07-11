const { Telegraf } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.TELETOK)

bot.help(ctx => {
    ctx.reply("The bot can perform the following commands\n - /start\n - /help\n - command")
})
bot.command((ctx) => ctx.replyWithPhoto({ source: 'screenshot.png' }))
bot.launch()

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://www.nytimes.com/')
  await page.screenshot({ path: 'screenshot.png', fullPage: true })
  await browser.close()
})()
