require('dotenv').config();
const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');
const e = require('express');
const schedule = require('node-schedule');

console.log('Server sedang berjalan');
const job = schedule.scheduleJob('00 16 19 * * *', function(){
  console.log('The answer to life, the universe, and everything!');


(async () => {
  const browser = await puppeteer.launch({ headless: "true" });
  const page = await browser.newPage();
  await page.goto('https://login.pens.ac.id/cas/login?service=http%3A%2F%2Fethol.pens.ac.id%2Fcas%2F', { timeout: 1500 });

  // masuk ke web
  await page.waitForSelector('#password');
  await page.type('#password', process.env.PASSWORD, { delay: 50 });
  await page.waitForSelector('#username');
  await page.type('#username', process.env.USER_NAME, { delay: 50 });
  // await page.waitForTimeout(5000);
  await page.click('#login > div.row.btn-row > input.btn-submit');

  // menunggu halaman diload semuanya

  await page.waitForSelector('#app > div > header > div > span > button > span > i')
  await page.click('#app > div > header > div > span > button > span > i', delay = 50);
  await page.waitForTimeout(2000);


  await page.click('#app > div.v-application--wrap > aside > div.v-navigation-drawer__content > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div.v-input__slot > div.v-select__slot > div.v-select__selections > div', delay = 50);

  await page.waitForTimeout(2000);

  //selector presensi
await page.waitForSelector('#app > div.v-application--wrap > aside > div.v-navigation-drawer__content > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)');
  await page.click('#app > div.v-application--wrap > aside > div.v-navigation-drawer__content > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1)', delay = 50);

await page.waitForTimeout(2000);



// print data absen
  let data = await page.$eval (
    '#app > div.v-application--wrap > aside > div.v-navigation-drawer__content > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div', 
    (element) => element.textContent
  );
  console.log(data);

  const token = process.env.BOT;
  const chatId = '@reminderpresensi';

  const bot = new TelegramBot(token, { polling: true });

  async function sendScheduledMessage() {
    let pesan = data;
    const message = pesan;
    await bot.sendMessage(chatId, `${message} \n\n Maintenence by @renggaferdiansa`);
    console.log('Message sent:', message);
    return;
  }

  await sendScheduledMessage();
  

  //masuk ke halaman absen
  page.click('#app > div.v-application--wrap > aside > div.v-navigation-drawer__content > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div');
  
  await page.waitForSelector('#app > div > main > div > div > div > div:nth-child(3) > div > div > div > div > div > div:nth-child(3) > button > span > span');
  page.click('#app > div > main > div > div > div > div:nth-child(3) > div > div > div > div > div > div:nth-child(3) > button');

  await page.waitForSelector('#app > div > main > div > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(4) > div > div.col-md-7.col-12 > button.v-btn.v-btn--block.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--small.primary > span');
  page.click('#app > div > main > div > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(4) > div > div.col-md-7.col-12 > button.v-btn.v-btn--block.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--small.primary > span');

  await page.waitForTimeout(2000);

  const  success = "Selamat, absensi berhasil dilakukan";
  console.log(success);

  async function successPresensi() {
    let pesan = success;
    const message = pesan;
    await bot.sendMessage(chatId, message);
    console.log('Message sent:', message);
    return;
  }

  await successPresensi();


  await browser.close();
  process.exit();
})();

});
