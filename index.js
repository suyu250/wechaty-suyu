const puppeteer = require('puppeteer');


async function run(constText) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.chat2ai.cn/');

    const inputSelector = 'input#input'; // 输入框的CSS选择器
    const inputContent = constText; // 要输入的内容

    await page.waitForSelector(inputSelector); // 等待输入框出现
    await page.type(inputSelector, inputContent); // 在输入框中输入内容

    const submitSelector = '.send'; // 提交按钮的CSS选择器
    await Promise.all([
        // page.waitForNavigation(), // 等待页面跳转完成
        page.click(submitSelector), // 点击提交按钮
    ]);

    const resultSelector = 'li.completion span'; // 输入框的CSS选择器
    const shengcheng = 'button.btn-response'; // 生成按钮
    // page.waitForFunction用这个方法来检测该网站中的一个元素，因为该网站返回的结果是逐字生成的，所以很难能让它返回出完整的答案。
    // 通过检测 停止/重新生成按钮，来判断它是否已经生成玩了，如果变成了"重新生成"， 说明答案已经生成完了，可以保证返回答案的完整性。
    await page.waitForFunction(
        (selector) => document.querySelector(selector).innerText === "重新生成", {},
        shengcheng
    );
    // await page.waitForTimeout(10000);

    // 获取返回结果的文本内容
    const result = await page.$$eval('li.completion span', (elements) => {
        return elements.map((el) => el.innerText).join('');
    });
    await browser.close();
    return result
}


export { run };