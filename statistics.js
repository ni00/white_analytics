"use strict";
const tcb = require('@cloudbase/node-sdk')
const searcher = require('node-ip2region').create();
exports.main = async (event, context) => {
    console.log("white_analytics is running!");
    const web_info = JSON.parse(event.queryStringParameters.info);
    web_info.user.ip = event.headers['x-real-ip'];
    const ip_info = searcher.btreeSearchSync(event.headers['x-real-ip']);
    web_info.user.cityCode = ip_info.city;
    web_info.user.region = ip_info.region;
    web_info.user.isp = ip_info.region.split("|")[4];

    const app = tcb.init({
        env: 'white-analytics-1gomqx8cb89f5715'
    })
    var db = app.database()

    db.collection('web_infos').add(web_info).then(res => {
        console.log(res)
    })

    console.log(JSON.stringify(web_info));
    return {
        statusCode: 200,
        headers: {
            "content-type": "text/json"
        },
        body: "console.log('white_analytics is running!');"
    };
};