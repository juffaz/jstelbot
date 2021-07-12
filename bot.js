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
const PAGE_URL = "http://elastic-cluster.service.prod-consul:5601/app/kibana#/discover?_g=()&_a=(columns:!(_source),index:'75d22fe0-3ea0-11ea-acb8-0f867b688565',interval:auto,query:(language:kuery,query:''),sort:!(!('@timestamp',desc)))"

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

function parseDataFromCommand(){
    let text = '/screen url=https://play.grafana.org/render/d-solo/000000012/grafana-play-home?orgId=1&from=startTime&to=endTime&panelId=11&width=1000&height=500&tz=Asia%2FBaku startTime=11.07.2021 endTime=12.07.2021'

    const match = text.match(/^\/([^\s]+)\s?(.+)?/)
    let args = [];
    let command='';
    if (match !== null) {
        if (match[1]) {
            command = match[1]
        }
        if (match[2]) {
            let list = match[2].split(' ');
            list.forEach(arg=>{
                let params = arg.split(/=(.*)/);
                args.push({
                    key:[params[0]],
                    value: params[1]
                });
            });
        }
    }

    function replaceParams(args){
        let result = args.filter(arg=>typeof arg.key !== 'url')[0].value;
        console.log(result);
        for (let index = 1; index < args.length; index++) {
            let element = args[index];
            let regex = new RegExp(element.key, 'gm')
            result = result.replace(regex, element.value)
        }
        return result;
    }
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
  await page.goto(url, {waitUntil : "networkidle0" });
  await page.screenshot({ path: 'screenshot.png', fullPage: false })
  await browser.close();
};


bot.use(commandArgsMiddleware());

bot.help(ctx => {
    ctx.reply("The bot can perform the following commands\n - /start\n - /help\n - command")
})

bot.command(async (ctx) => {
  await getScreenShot(PAGE_URL);
  console.log(ctx.state);
  ctx.replyWithPhoto({ source: 'screenshot.png' });
});

bot.launch()

