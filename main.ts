// main.ts

import {
    config,
    Wechaty,
    log,
    ScanStatus,
    WechatyBuilder,
    Message,

} from 'wechaty'

import { PuppetPadlocal } from "wechaty-puppet-padlocal";
// 引入axios
import axios, { Axios } from 'axios';
import { Contact } from 'wechaty-puppet/types';
// import { MessageType } from 'message-type';
import { FileBox } from 'file-box'



// 这里填写申请的token
const puppet = new PuppetPadlocal({
    token: "puppet_padlocal_9e40ee64a59e498f8670854843913b1c"
})


let imgUrl = '';
let videoUrl = '';
let singContent = '';
let musicContent = '';


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

// 美女视频
function RandomVideo() {
    axios.get('http://hbkgds.com/api/jiepai.php')
        .then(function (response) {
            let video = response.data.split('🗽视频：')
            videoUrl = video[1]
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

// 随机唱鸭
function RandomSing() {
    axios.get('http://api1.duozy.cn/api/changya.php')
        .then(function (response) {
            let sing = response.data.split('━━━━━━━━━')
            singContent = sing[1]
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}


// 网易云随机歌曲
function RandomMusic() {
    axios.get('http://api1.duozy.cn/api/neran.php')
        .then(function (response) {
            let music = response.data.split('━━━━━━━━━')
            musicContent = music[1]
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
        const mentionSelf = await message.mentionSelf()    // 获取机器人是否在群里被@ 了

        // 判断联系人类型是否为公众号(不回复公众号的消息)
        if (sender.type() === bot.Contact.Type.Official) {
            return
        }


        // 自己说的话，不回复(微信团队在里面检测为好友类型 所以这里单独加上 微信团队的消息也不回复)
        if (message.self() || sender.name() === '微信团队') {
            return
        }

        // 获取撤回的信息
        // if (message.type() === MessageType.Recalled) {
        //     const recalledMessage = await message.toRecalled()
        //     message.say(`Message: ${sender} 撤回了一条消息. 内容为：${recalledMessage}`)
        // }




        // if (room && mentionSelf) {
        //     if (/句子互动/.test(content)) {
        //         await room?.say('666')
        //         return
        //     }
        // }

        if (content == '随机图片') {
            RandomPicture();
            setTimeout(() => {
                if (imgUrl !== '') {
                    // 图片大小建议不要超过 2 M
                    const imageFilePath = imgUrl;
                    const fileBox = FileBox.fromUrl(imageFilePath);

                    // const fileBox = FileBox.fromFile("https://.../image.jpeg");
                    message.say(fileBox);
                } else {
                    message.say('请求超时')
                }
            }, 4000)
            return;
        }

        if (content == '美女视频') {
            RandomVideo();
            message.say('正在获取中,请稍后....');
            const Video_Timer = setTimeout(() => {
                if (videoUrl === '') {
                    message.say('请求超时,请尝试重新发送!')
                    clearInterval(VideoTimer)
                }
            }, 20000)  // 15秒钟后没获取到链接 清楚定时器

            const VideoTimer = setInterval(() => {
                if (videoUrl !== '') {
                    const videoFilePath = videoUrl;
                    const fileBox = FileBox.fromUrl(videoFilePath);
                    message.say(fileBox);
                    clearInterval(VideoTimer);
                    clearTimeout(Video_Timer);
                }
            }, 1000)
            return;
        }

        if (content == '随机唱鸭' || content == '随机唱呀') {
            RandomSing();
            message.say('正在获取中,请稍后....');
            const sing_Timer = setTimeout(() => {
                if (singContent === '') {
                    message.say('请求超时,请尝试重新发送!')
                    clearInterval(singTimer)
                }
            }, 10000)  // 10秒钟后没获取到链接 清楚定时器

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
            message.say('正在获取中,请稍后....');
            const music_Timer = setTimeout(() => {
                if (musicContent === '') {
                    message.say('请求超时,请尝试重新发送!')
                    clearInterval(musicTimer)
                }
            }, 10000)  // 10秒钟后没获取到链接 清楚定时器

            const musicTimer = setInterval(() => {
                if (musicContent !== '') {
                    message.say(musicContent);
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

        // 进入机器人聊天
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
                message.say(botmess)
            } else {
                message.say('你有病哦！')
            }
        }, 4000)


    } catch (e) {
        console.error(e)
    }
}


const bot = WechatyBuilder.build({
    name: "PadLocalDemo",
    puppet,
})
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

    .on("login", (user) => {
        log.info(`${user} login`);
    })

    .on("logout", (user, reason) => {
        log.info(`${user} logout, reason: ${reason}`);
    })

    .on('message', onMessage)


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