const inquirer = require('inquirer');
const puppeteer = require('puppeteer');

const CHROME_EXECUTABLE_PATH = '';
const USER_DATA_DIR = '';
const LINKED_IN_MESSAGES_URL = 'https://www.linkedin.com/messaging';

const args = [
    `--user-data-dir=${USER_DATA_DIR}`,
    '--window-size=1920,1080'
];

const ACTION_DELETE = 'Delete messages';
const ACTION_ARCHIVE = 'Archive messages';

const inquire = async function () {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Please, choose an action to perform:',
            name: 'action',
            choices: [ACTION_DELETE, ACTION_ARCHIVE],
        }
    ])
        .then(async answers => {
            if (answers && answers.action) {
                await performLinkedInAction(answers.action);
            }
        })
        .catch(error => {
            if (error.isTtyError) {
                console.log('Prompt couldn\'t be rendered in the current environment');
            } else {
                console.log(error);
            }
        });
}

const performLinkedInAction = async function (action) {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: CHROME_EXECUTABLE_PATH,
        args
    });

    const page = await browser.newPage();
    await page.setViewport({width: 0, height: 0});
    await page.goto(LINKED_IN_MESSAGES_URL);

    let contentExists = true;

    while (contentExists) {
        await page.click('.msg-conversation-listitem');
        await page.click('.msg-thread-actions__control');

        await page.waitForSelector('.msg-thread-actions__dropdown-option');
        const msgActions = await page.$$('.msg-thread-actions__dropdown-option');
        const msgTexts = await page.evaluate(() => Array.from(document.querySelectorAll('.msg-thread-actions__dropdown-option'), element => element.textContent));

        for (let i = 0; i <= msgTexts.length; i++) {
            if (action === ACTION_ARCHIVE) {
                if (msgTexts[i] && msgTexts[i].indexOf('Archive') >= 0) {
                    await msgActions[i].click();
                }
            }
            if (action === ACTION_DELETE) {
                if (msgTexts[i] && msgTexts[i].indexOf('Delete') >= 0) {
                    await msgActions[i].click();
                    await page.waitForSelector('.msg-modal-delete-convo');

                    await page.click('.artdeco-button--primary');
                    await page.click('.artdeco-button--secondary');
                }
            }
        }
        const scrollable_section = '.msg-conversations-container__conversations-list';

        await page.evaluate(selector => {
            const scrollableSection = document.querySelector(selector);

            scrollableSection.scrollTop = scrollableSection.offsetHeight;
        }, scrollable_section);

        contentExists = await page.$('.msg-conversation-listitem') !== null;

        sleep(2000);
    }

    await browser.close();
}

const sleep = function (milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

module.exports = {
    inquire
};
