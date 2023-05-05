const { Telegraf } = require('telegraf')
require('dotenv').config()
const bot = new Telegraf(process.env.TELETOK)
const puppeteer = require('puppeteer');
const AUTH_DATA = {
  url:'',
  login:'',
  password:''
}
const PAGE_URL_1 = 'https://play.grafana.org/d/000000012/grafana-play-home?orgId=1';
const PAGE_URL = "https://elasticsearch.bank/app/apm#/traces?rangeFrom=now-1h&rangeTo=now&refreshPaused=true&refreshInterval=0&page=0&pageSize=25&sortField=averageResponseTime&sortDirection=desc"
//const PAGE_URL = "https://elasticsearch.bank.az/app/apm#/traces?rangeFrom=now-15m&rangeTo=now&refreshPaused=true&refreshInterval=0&page=0&pageSize=25&sortField=averageResponseTime&sortDirection=desc"

const PAGE_URL_2 = "http://kibana.service.test-consul:5601/app/kibana#/discover?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&_a=(columns:!(_source),filters:!(),index:'3fdd5940-c36b-11eb-b0e8-a174df9056c9',interval:auto,query:(language:kuery,query:%22python-requests%2F2.25.1%22),sort:!())"

const commandArgsMiddleware = () => (ctx, next) =>{
 console.log('middleware', ctx,);
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
  await page.setViewport({ width: 1280, height: 1500 })
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
  await page.goto(url, {waitUntil : "networkidle0" });
  await page.screenshot({ path: 'screenshot.png', fullPage: false })
  await browser.close();
};


bot.use(commandArgsMiddleware());

bot.help(ctx => {
    ctx.reply("The bot can perform the following commands\n - /start\n - /help\n - command")
})

bot.command("screen", async (ctx) => {
  await getScreenShot(PAGE_URL);
  console.log(ctx, ctx.state);
  ctx.replyWithPhoto({ source: 'screenshot.png' });
});

bot.launch()
