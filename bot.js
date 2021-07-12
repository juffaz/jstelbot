const { Telegraf } = require('telegraf')
require('dotenv').config()
const bot = new Telegraf(process.env.TELETOK)
const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://play.grafana.org/d/000000012/grafana-play-home?orgId=1')
  await page.screenshot({ path: 'screenshot.png', fullPage: true })
  await browser.close()
  
  bot.help(ctx => {
    ctx.reply("The bot can perform the following commands\n - /start\n - /help\n - command")
   })
  bot.command((ctx) => ctx.replyWithPhoto({ source: 'screenshot.png' }))
  bot.launch()
  
  })()




