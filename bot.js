const { Telegraf } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.TELETOK)

bot.help(ctx => {
    ctx.reply("The bot can perform the following commands\n - /start\n - /help\n - command")
})
bot.command((ctx) => ctx.replyWithPhoto({ source: 'screenshot.png' }))
bot.launch()
const puppeteer = require('puppeteer');

const santos_SELECTOR = 'body > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > a:nth-child(1)'

const username_SELECTOR = '#userid';

const password_SELECTOR = '#password';

const cta_SELECTOR = '#btLog'; 

const username = 'user'

const password = 'password'

const movimentacoes = 'div.itPagina:nth-child(30) > a:nth-child(1)'

const url = 'https://www.sppilots.com.br/'

async function startBrowser() {

  const browser = await puppeteer.launch({headless: false});

  const page = await browser.newPage();

  return {browser, page};

}

async function playTest() {

  const {browser, page} = await startBrowser();

  page.setViewport({width: 1366, height: 768});

  await page.goto(url);

  await page.click(santos_SELECTOR)

  await page.click(username_SELECTOR);

  await page.keyboard.type(username);

  await page.click(password_SELECTOR);

  await page.keyboard.type(password);

  await page.click(cta_SELECTOR);

  await page.click(movimentacoes);

  await page.screenshot({path: "screenshot.png"})

}

(async () => {

  await playTest("https://www.sppilots.com.br/");

  process.exit(1);

})();

