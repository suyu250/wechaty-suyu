// main.ts

import {
    config,
    Wechaty,
    log,
    ScanStatus,
    WechatyBuilder,
    Message,
    Friendship,
} from 'wechaty'

import { PuppetPadlocal } from "wechaty-puppet-padlocal";
// 引入axios
import axios, { Axios } from 'axios';
import { Contact } from 'wechaty-puppet/types';


import { FileBox } from 'file-box';
import * as PUPPET from 'wechaty-puppet'
import { run } from './index.js';


// 这里填写申请的token
const puppet = new PuppetPadlocal({
    token: "puppet_padlocal_73a2fea2f69e4a42a27bdd2a4abe8f27"
})


// 定义一个从字符串中截取链接的方法
function getUrl(str: string) {
    const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    const strValue = str.match(reg);
    if (strValue && strValue.length > 0) {
        return strValue[0];
    }
    return '';
}

let imgUrl = '';
let buyerImg = '';
let videoUrl = '';
let singContent = '';
let musicUrl = '';
let musicName = '';
let isRoom = false;  //  闲聊模式的开关 默认为关闭
let renjian = '';
var TextImg = '';
let tempMessage = '';   // 临时存消息
let Msg = '';   // 小人举牌
let chatgpt = false;

// 随机图片
function RandomPicture() {
    axios.get('https://api.a20safe.com/api.php?api=9&key=093fd4ec53ad156c68c1ecabcfa399d3&lx=suiji')
        .then(function (response) {
            imgUrl = response.data.data[0].imgurl
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

// 随机买家秀
function BuyerShow() {
    axios.get('http://www.plapi.cc/api/mjx.php')
        .then(function (response) {
            buyerImg = response.data
            console.log(response.data)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

// 举牌
function Placards(msg: string) {
    axios.get('http://www.plapi.cc/api/acard.php?msg=' + msg)
        .then(function (response) {
            Msg = response.data
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

// 美女视频
function RandomVideo() {
    axios.get('https://v.api.aa1.cn/api/api-dy-girl/index.php?aa1=json')
        .then(function (response) {
            videoUrl = response.data.mp4
            // videoUrl = video[1]
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

// 随机唱鸭
function RandomSing() {
    axios.get('http://www.plapi.cc/api/changya.php')
        .then(function (response) {
            let sing = response.data
            singContent = sing
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}


// 网易云随机歌曲
function RandomMusic() {
    axios.get('https://api.uomg.com/api/rand.music?sort=热歌榜&format=json')
        .then(function (response) {
            let music_name = response.data.data.name
            let music_url = response.data.data.url
            musicName = music_name
            musicUrl = music_url
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

// 我在人间凑数
function OnEarth() {
    axios.get('http://hbkgds.com/api/renjian.php')
        .then(function (response) {
            renjian = response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}


//生成发光字
function LuminousWord(id: string, msg: string) {
    axios.get('http://hbkgds.com/api/jqwjp.php?id=' + id + '&msg=' + msg)
        .then(function (response) {
            let url = response.data
            TextImg = getUrl(url)
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

async function onMessage(message: Message) {

    try {
        const room = message.room()     // 获取消息是否来自群里
        const sender = message.talker()  // 获取消息发送者
        const content = message.text()   // 获取消息的内容
        let botmess = ""
        // const mentionSelf = await message.mentionSelf()    // 获取机器人是否在群里被@ 了



        // 判断联系人类型是否为公众号(不回复公众号的消息)
        if (sender.type() === bot.Contact.Type.Official) {
            return
        }


        // 自己说的话，不回复(微信团队在里面检测为好友类型 所以这里单独加上 微信团队的消息也不回复)
        if (message.self() || sender.name() === '微信团队') {
            return
        }


        // 获取撤回消息的文本内容
        if (message.type() === PUPPET.types.Message.Recalled) {
            // const recalledMessage = await message.toRecalled()
            message.say(`${sender}撤回了一条消息,内容为:${tempMessage}`)
            return;
        }


        tempMessage = content;
        // 功能菜单
        if (content === '菜单' || content === '功能') {
            message.say('[' + sender + ']: ' + content + '\n'
                + '-------------------------' + '\n'
                + '❤️[1].随机图片(口令👉:随机图片)' + '\n'
                + '❤️[2].美女视频(口令👉:美女视频)' + '\n'
                + '❤️[3].买家秀(口令👉:美女视频)' + '\n'
                + '❤️[4].随机唱鸭(口令👉:随机唱鸭)' + '\n'
                + '❤️[5].网易云随机歌曲(口令👉:网易云随机歌曲)' + '\n'
                + '❤️[6].听香水有毒(口令👉:我想听香水有毒)' + '\n'
                + '❤️[7].闲聊模式(口令👉:开启/关闭闲聊模式 在群里默认为关闭)' + '\n'
                + '❤️[8].我在人间凑数语录(口令👉:我在人间凑数)' + '\n'
                + '❤️[9].举牌生成(示例👉:举牌生成+苏羽)' + '\n'
                + '❤️[10].发光字生成(示例👉: 发光字生成+1+苏羽很帅)' + '\n'
                + '介绍:{1.手写荧光字 2.手写火焰字 3.手写炫彩字' + '\n'
                + '4.连笔荧光字 5.连笔火焰字 6.连笔黑色字' + '\n'
                + '7.连笔玉雕字 8.连笔刻雕字 9.艺术花鸟签}' + '\n'
                + '.......更多功能，敬请期待！' + '\n')
            return;
        }

        if (content == '随机图片') {
            RandomPicture();
            message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '正在获取中,请稍后....');
            setTimeout(() => {
                if (imgUrl !== '') {
                    // 图片大小建议不要超过 2 M
                    const imageFilePath = imgUrl;
                    const fileBox = FileBox.fromUrl(imageFilePath);

                    // const fileBox = FileBox.fromFile("https://.../image.jpeg");
                    message.say(fileBox);
                } else {
                    message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '请求超时')
                }
            }, 4000)
            return;
        }


        if (content == '买家秀') {
            BuyerShow();
            message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '正在获取中,请稍后....');
            setTimeout(() => {
                if (buyerImg !== '') {
                    // 图片大小建议不要超过 2 M
                    const imageFilePath = buyerImg;
                    const fileBox = FileBox.fromUrl(imageFilePath);

                    // const fileBox = FileBox.fromFile("https://.../image.jpeg");
                    message.say(fileBox);
                } else {
                    message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '请求超时')
                }
            }, 4000)
            return;
        }

        if (content == '美女视频') {
            RandomVideo();
            message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '正在获取中,请稍后....');
            const Video_Timer = setTimeout(() => {
                if (videoUrl === '') {
                    message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '请求超时,请尝试重新发送!')
                    clearInterval(VideoTimer)
                }
            }, 20000)  // 20秒钟后没获取到链接 清楚定时器

            const VideoTimer = setInterval(() => {
                if (videoUrl !== '') {
                    const videoFilePath = 'https:' + videoUrl;
                    // 因为这个接口里面有中文不能直接访问，所以要用encodeURI方法进行url编码
                    const videoFilePath2 = encodeURI(videoFilePath);
                    const fileBox = FileBox.fromUrl(videoFilePath2);
                    console.log(videoFilePath2);
                    message.say(fileBox);
                    clearInterval(VideoTimer);
                    clearTimeout(Video_Timer);
                }
            }, 1000)
            return;
        }

        if (content == '随机唱鸭' || content == '随机唱呀') {
            RandomSing();
            message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '正在获取中,请稍后....');
            const sing_Timer = setTimeout(() => {
                if (singContent === '') {
                    message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '请求超时,请尝试重新发送!')
                    clearInterval(singTimer)
                }
            }, 20000)  // 10秒钟后没获取到链接 清楚定时器

            const singTimer = setInterval(() => {
                if (singContent !== '') {
                    message.say(singContent);
                    clearInterval(singTimer);
                    clearTimeout(sing_Timer);
                }
            }, 1000)
            return;
        }

        if (content == '网易云随机歌曲') {
            RandomMusic();
            message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '正在获取中,请稍后....');
            const music_Timer = setTimeout(() => {
                if (musicUrl === '') {
                    message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '请求超时,请尝试重新发送!')
                    clearInterval(musicTimer)
                }
            }, 10000)  // 10秒钟后没获取到链接 清楚定时器

            const musicTimer = setInterval(() => {
                if (musicUrl !== '') {
                    message.say('歌曲名:' + musicName + '\n' + '歌曲链接:' + musicUrl);
                    clearInterval(musicTimer);
                    clearTimeout(music_Timer);
                }
            }, 1000)
            return;
        }

        if (content == '我想听香水有毒') {
            const voiceFilePath = "./silk/七喜 - 香水有毒 (七喜版).mp3"
            const voiceLength = 10000; // 需要提供语音长度，单位为毫秒

            const fileBox = FileBox.fromFile(voiceFilePath);
            fileBox.mimeType = "audio/silk";
            fileBox.metadata = {
                voiceLength,
            };

            message.say(fileBox);
            return;
        }

        if (content === '我在人间凑数') {
            OnEarth();
            message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '正在获取中,请稍后....');
            setTimeout(() => {
                if (renjian !== '') {
                    message.say(renjian);
                } else {
                    message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '请求超时')
                }
            }, 4000)
            return;
        }

        let valueText = content.split('+')
        if (valueText[0] === '发光字生成' && /^[1-9]+$/.test(valueText[1]) && valueText[2] !== undefined) {
            if (parseInt(valueText[1]) > 0 && parseInt(valueText[1]) < 10) {
                message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '正在生成中，请稍后...')
                LuminousWord(valueText[1], valueText[2]);
                setTimeout(() => {
                    if (/^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(TextImg)) {
                        // 图片大小建议不要超过 2 M
                        const imageFilePath = TextImg;
                        const fileBox = FileBox.fromUrl(imageFilePath);
                        message.say(fileBox);
                    } else {
                        message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '请求超时')
                    }
                }, 4000)
                return;
            } else {
                message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '口令错误,序号范围在1-9之间，请重新输入！')
            }
        }

        if (valueText[0] === '举牌生成' && valueText[1] !== undefined) {
            message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '正在生成中，请稍后...')
            Placards(valueText[1]);
            const pla_timer = setTimeout(() => {
                if (Msg === '') {
                    message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '请求超时');
                    clearInterval(plaTimer);
                }
            }, 15000)

            const plaTimer = setInterval(() => {
                if (Msg !== '') {
                    clearInterval(plaTimer);
                    clearTimeout(pla_timer);
                    // 图片大小建议不要超过 2 M
                    const imageFilePath = Msg;
                    const fileBox = FileBox.fromUrl(imageFilePath);
                    message.say(fileBox);
                }
            }, 2000)

            return;
        }



        //判断消息是否在群里
        if (room) {
            if (content === '开启闲聊模式') {
                isRoom = true // 开启
                chatgpt = false
                message.say("闲聊模式开启成功！")
                return;
            } else if (content === '关闭闲聊模式') {
                isRoom = false  // 关闭
                message.say("闲聊模式关闭成功！")
                return;
            }

            if (content === '开启chatgpt模式') {
                chatgpt = true // 开启
                isRoom = false
                message.say("chatgpt模式开启成功！")
                return;
            } else if (content === '关闭chatgpt模式') {
                chatgpt = false  // 关闭
                message.say("chatgpt模式关闭成功！")
                return;
            }

            // 判断 闲聊模式开关是否开启
            if (isRoom === true) {
                feifei();
                return;
            }
            // 判断 ChatGPT模式开关是否开启
            if (chatgpt === true) {
                let TextContent = run(content);
                message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + TextContent);
                return;
            } else {
                return;
            }
        }

        // if (room) {
        //     if (mentionSelf) {

        //         feifei();
        //         return;
        //     } else {
        //         return;
        //     }
        // }



        feifei();


        // 进入机器人聊天
        function feifei() {
            axios.get('https://api.a20safe.com/api.php?api=33&key=093fd4ec53ad156c68c1ecabcfa399d3&text=' + content)
                .then(function (response) {
                    botmess = response.data.data[0].content
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })


            setTimeout(() => {
                if (botmess !== '') {
                    message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + botmess)
                } else {
                    message.say('[' + sender + ']: ' + content + '\n' + '-------------------------' + '\n' + '请求超时！')
                }
            }, 5000)

        }

    } catch (e) {
        console.error(e)
    }
}


const bot = WechatyBuilder.build({
    name: "PadLocalDemo",
    puppet,
})   // 获取登录二维码
    .on("scan", (qrcode, status) => {
        if (status === ScanStatus.Waiting && qrcode) {
            const qrcodeImageUrl = [
                'https://wechaty.js.org/qrcode/',
                encodeURIComponent(qrcode),
            ].join('')

            log.info(`onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);

            require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console
        } else {
            log.info(`onScan: ${ScanStatus[status]}(${status})`);
        }
    })
    // 登录成功后 事件
    .on("login", (user) => {
        log.info(`${user} login`);
    })
    // 注销登录
    .on("logout", (user, reason) => {
        log.info(`${user} logout, reason: ${reason}`);
    })
    // 监听消息事件
    .on('message', onMessage)
    // 监听好友请求 并自动通过
    .on("friendship", async (friendship: Friendship) => {
        if (friendship.type() === PUPPET.types.Friendship.Receive) {
            await friendship.accept();
        }
    });

bot.start().then(() => {
    log.info("started.");
});


//获取所有的微信联系人id和名称
// const contactList = await bot.Contact.findAll()

// log.info('苏羽机器人', '获取所有的微信联系人id和名称')

// /**
//  * official contacts list
//  */
// for (let i = 0; i < contactList.length; i++) {
//     const contact = contactList[i]
//     if (contact.type() === bot.Contact.Type.Official) {
//         log.info('Bot', `official ${i}: ${contact}`)
//     }
// }

// /**
//  *  personal contact list
//  */

// for (let i = 0; i < contactList.length; i++) {
//     const contact = contactList[i]
//     if (contact.type() === bot.Contact.Type.Individual) {
//         log.info('Bot', `personal ${i}: ${contact.name()} : ${contact.id}`)
//     }
// }