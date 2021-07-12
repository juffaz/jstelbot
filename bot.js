const { Telegraf } = require('telegraf')
require('dotenv').config()
const bot = new Telegraf(process.env.TELETOK)
const puppeteer = require('puppeteer');
const AUTH_DATA = {
  url:'',
  login:'',
  password:''
}
const PAGE_URL = 'https://play.grafana.org/d/000000012/grafana-play-home?orgId=1';

const commandArgsMiddleware = () => (ctx, next) => {
  if (ctx.updateType === 'message' && ctx.updateSubType === 'text') {
    const text = ctx.update.message.text.toLowerCase()
    if (text.startsWith('/')) {
      const match = text.match(/^\/([^\s]+)\s?(.+)?/)
      let args = []
      let command
      if (match !== null) {
        if (match[1]) {
          command = match[1]
        }
        if (match[2]) {
          args = match[2].split(' ')
        }
      }

      ctx.state.command = {
        raw: text,
        command,
        args
      }
    }
  }
  return next()
}

async function initBrowser() {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  return { browser, page };
}

const loginGrapha = async() => {
  const { browser, page } = await initBrowser();
  const { url, login, password } = AUTH_DATA;
  await page.goto(url);
  await page.click('.loginInputFieldclass');
  await page.keyboard.type(login);
  await page.click('.passwordInputFieldclass');
  await page.keyboard.type(password);
  await page.click('.loginButton');
  return { browser, page };
}


const getScreenShot = async (url) => {
  const {browser, page} = await initBrowser();
  await page.goto(url, {"waitUntil" : "domcontentloaded"});
  await page.screenshot({ path: 'screenshot.png', fullPage: true })
  await browser.close();
};


bot.use(commandArgsMiddleware());

bot.help(ctx => {
    ctx.reply("The bot can perform the following commands\n - /start\n - /help\n - command")
})

bot.command(async (ctx) => {
  await getScreenShot(PAGE_URL);
  console.log(ctx.state.command);
  ctx.replyWithPhoto({ source: 'screenshot.png' });
});

bot.launch()


