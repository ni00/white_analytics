"use strict";
const tcb = require('@cloudbase/node-sdk')
const userAgent = require("useragent.js");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc') // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

function time_info(t) {
    const result = {
        year: {},
        month: {},
        day: {},
        week: {
            "星期一":0,
            "星期二":0,
            "星期三":0,
            "星期四":0,
            "星期五":0,
            "星期六":0,
            "星期天":0
        },
        hour: {},
    }

    const now = dayjs().tz("Asia/Shanghai");
    //近七天
    for(let i=6;i>=0;i--){
        const m = dayjs().tz("Asia/Shanghai").subtract(i, 'day');
        const year = m.year();
        const month = m.month() + 1;
        const day = m.date();
        const day_str = year + "-" + month + "-" + day;
        result.day[day_str]=0;
    }
    //近十二个月
    for (let i=11;i>=0;i--){
        const m = dayjs().tz("Asia/Shanghai").subtract(i, 'month');
        const year = m.year();
        const month = m.month() + 1;
        const month_str = year + "-" + month;
        result.month[month_str] = 0;
    }
    //二十四点
    for (let i=0;i<=23;i++){
       result.hour[i+"点"] = 0;
    }

    t.forEach(i => {
        const m = dayjs(i.time).tz("Asia/Shanghai");

        const year = m.year();
        result.year[year] = (result.year[year] ? result.year[year] + 1 : 1);

        const month = m.month() + 1;
        const month_str = year + "-" + month;
        if(result.month[month_str]>=0){
            result.month[month_str] = result.month[month_str] + 1
        }

        const day = m.date();
        const day_str = year + "-" + month + "-" + day;
        if(result.day[day_str]>=0){
            result.day[day_str] = result.day[day_str] + 1
        }

        let week = m.day();
        switch (week) {
            case 0:
                week = "星期天";
                break;
            case 1:
                week = "星期一";
                break;
            case 2:
                week = "星期二";
                break;
            case 3:
                week = "星期三";
                break;
            case 4:
                week = "星期四";
                break;
            case 5:
                week = "星期五";
                break;
            case 6:
                week = "星期六";
        }
        result.week[week] = (result.week[week] ? result.week[week] + 1 : 1);

        const hour = m.hour() + "点";
        result.hour[hour] = (result.hour[hour] ? result.hour[hour] + 1 : 1);

    })



    return result;
}

function user_info(t) {
    const result = {
        isp: {},
        city: {},
        province: {},
        uid: 0,
        ip: 0,
        total: 0
    }
    result.total = t.length;
    const uids={};
    const ips={};
    t.forEach(i => {
        const u = i.user;

        //仅记录中国用户地域数据
        if (u.region.split("|")[0] === "中国") {
            const city = u.region.split("|")[3];
            result.city[city] = (result.city[city] ? result.city[city] + 1 : 1);
            const province = u.region.split("|")[2];
            result.province[province] = (result.province[province] ? result.province[province] + 1 : 1);
        }

        let isp = u.isp;
        if (isp==="0"){
            isp = "未知";
        }
        result.isp[isp] = (result.isp[isp] ? result.isp[isp] + 1 : 1);

        const uid = u.id;
        uids[uid] = (uids[uid] ? uids[uid] + 1 : 1);

        const ip = u.ip;
        ips[ip] = (ips[ip] ? ips[ip] + 1 : 1);
    })

    result.uid = Object.keys(uids).length;
    result.ip = Object.keys(ips).length;

    //ISP信息排序处理
    const isp_arr = [];
    for(let i in result.isp){
        isp_arr.push({
            type:i,
            value:result.isp[i]
        })
    }
    isp_arr.sort(function(a,b){
        return b.value - a.value
    });
    result.isp = isp_arr//.slice(0,10);

    //城市信息排序处理
    const city_arr = [];
    for(let i in result.city){
        city_arr.push({
            type:i,
            value:result.city[i]
        })
    }
    city_arr.sort(function(a,b){
        return b.value - a.value
    });
    result.city = city_arr//.slice(0,10);

    //省份信息排序处理
    const province_arr = [];
    for(let i in result.province){
        province_arr.push({
            type:i,
            value:result.province[i]
        })
    }
    province_arr.sort(function(a,b){
        return b.value - a.value
    });
    result.province = province_arr//.slice(0,10);

    return result;
}

function page_info(t) {
    const result = {
        //title: {},
        url: {},
        referrer: {},
        protocol: {}
    }

    t.forEach(i => {
        // const title = i.page.title;
        // result.title[title] = (result.title[title] ? result.title[title] + 1 : 1);

        const url = i.page.nowurl;
        result.url[url] = (result.url[url] ? result.url[url] + 1 : 1);

        let referrer = i.page.fromurl;
        if (referrer === "") {
            referrer = "直接访问"
        }
        result.referrer[referrer] = (result.referrer[referrer] ? result.referrer[referrer] + 1 : 1);

        const protocol = i.location.protocol;
        result.protocol[protocol] = (result.protocol[protocol] ? result.protocol[protocol] + 1 : 1);
    })
    //链接信息排序处理
    const url_arr = [];
    for(let i in result.url){
        url_arr.push({
            link:i,
            value:result.url[i]
        })
    }
    url_arr.sort(function(a,b){
        return b.value - a.value
    });
    result.url = url_arr.slice(0,10);
    //来源信息排序处理
    const refer_arr = [];
    for(let i in result.referrer){
        refer_arr.push({
            link:i,
            value:result.referrer[i]
        })
    }
    refer_arr.sort(function(a,b){
        return b.value - a.value
    });
    result.referrer = refer_arr.slice(0,10);
    //访问协议排序处理
    const protocol_arr = [];
    for(let i in result.protocol){
        protocol_arr.push({
            link:i,
            value:result.protocol[i]
        })
    }
    protocol_arr.sort(function(a,b){
        return b.value - a.value
    });
    result.protocol = protocol_arr.slice(0,10);
    return result;
}

function other_info(t) {
    const result = {
        lang: {},
        browser: {},
        os: {},
        device: {}
    }
    t.forEach(i => {
        const ua = userAgent.analyze(i.navigator.userAgent);

        const lang = i.navigator.language.toLowerCase();
        if(lang && lang.trim()) {
            result.lang[lang] = (result.lang[lang] ? result.lang[lang] + 1 : 1);
        }

        const os = ua.os.full;
        if(os && os.trim()){
            result.os[os] = (result.os[os] ? result.os[os] + 1 : 1);
        }

        const browser = ua.browser.name;
        if(browser && browser.trim()) {
            result.browser[browser] = (result.browser[browser] ? result.browser[browser] + 1 : 1);
        }

        const device = ua.device.full;
        if(device && device.trim()) {
            result.device[device] = (result.device[device] ? result.device[device] + 1 : 1);
        }

    })
    //语言环境排序处理
    const lang_arr = [];
    for(let i in result.lang){
        lang_arr.push({
            type:i,
            value:result.lang[i]
        })
    }
    lang_arr.sort(function(a,b){
        return b.value - a.value
    });
    result.lang = lang_arr.slice(0,10);

    //系统排序处理
    const os_arr = [];
    for(let i in result.os){
        os_arr.push({
            type:i,
            value:result.os[i]
        })
    }
    os_arr.sort(function(a,b){
        return b.value - a.value
    });
    result.os = os_arr//.slice(0,10);

    //浏览器排序处理
    const browser_arr = [];
    for(let i in result.browser){
        browser_arr.push({
            type:i,
            value:result.browser[i]
        })
    }
    browser_arr.sort(function(a,b){
        return b.value - a.value
    });
    result.browser = browser_arr//.slice(0,10);

    //设备排序处理
    const device_arr = [];
    for(let i in result.device){
        device_arr.push({
            type:i,
            value:result.device[i]
        })
    }
    device_arr.sort(function(a,b){
        return b.value - a.value
    });
    result.device = device_arr//.slice(0,10);


    return result;
}

exports.main = async (event, context) => {
    console.log("white_analytics is running!");
    //const key = event.queryStringParameters.key;

    const app = tcb.init({
        env: 'white-analytics-1gomqx8cb89f5715'
    })

    const db = app.database()
    const _ = db.command

    const web_infos = db.collection('web_infos').get()

    const infos = await web_infos;

    const result = {};
    result.time=time_info(infos.data);
    result.user=user_info(infos.data);
    result.page=page_info(infos.data);
    result.other=other_info(infos.data);

    return {
        statusCode: 200,
        headers: {
            "content-type": "text/json"
        },
        body: JSON.stringify(result)
    };
};