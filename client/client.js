var url = "https://func.nixiaobai.com/statistics";
//云函数统计接口

function bin2hex(s) {
    var i,
        l,
        o = "",
        n;
    s += "";
    for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i).toString(16);
        o += n.length < 2 ? "0" + n : n;
    }

    return o;
}

function getUUID(domain) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var txt = domain;
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "tencent";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);

    var b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
    var bin = atob(b64);
    var crc = bin2hex(bin.slice(-16, -12));
    return crc;
}

var id = getUUID("whiteAnalytics");

var info = {
    user: {
        id: id,
    },
    page: {
        title: document.title,
        nowurl: document.URL,
        fromurl: document.referrer,
    },

    navigator: {
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        appCodeName: navigator.appCodeName,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language:
            navigator.language ||
            navigator.userLanguage ||
            navigator.systemLanguage ||
            navigator.browserLanguage,
    },

    screen: {
        height: screen.height,
        width: screen.width,
        pixelDepth: screen.pixelDepth,
        colorDepth: screen.colorDepth,
    },

    location: {
        href: location.href,
        origin: location.origin,
        protocol: location.protocol,
        ancestorOrigins: location.ancestorOrigins,
        host: location.host,
        hostname: location.hostname,
        port: location.port,
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
    },
};

var infos = JSON.stringify(info);
var api_url = `${url}?info=${infos}`;
var script = document.createElement("script");
script.setAttribute("src", api_url);
document.getElementsByTagName("head")[0].appendChild(script);
