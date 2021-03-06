const http = require('http');
const querystring = require('querystring');
const iconv = require('iconv-lite');
var $ = jQuery = require('../node_modules/jquery/dist/jquery.slim.min.js');
const IMG_TEMPLATE = '<img referrerpolicy="no-referrer" class="thumbnail" src="';
var pc = '0';
var post_id = '0';

function initialFetchBBS () {
    const URL = $('[name="bbsurl"] option:selected').val();
    http.get(URL, (res) => {
        var chunks = [];
        res.on('data', (chunk) => {
            chunks.push(chunk);
        });

        res.on('end', (res) => {
            var body = iconv.decode(Buffer.concat(chunks), 'cp932');
            body = body.replace(/<!--[\s\S]*?-->/g, '').replace(/\r\n/g, '\r').replace(/\n/g, '\r');
            body = body.replace(/<A /g, '<A target="_blank" ');
            pc = body.match(/name="pc" value="(\d+)"/)[1];
            post_id = body.match(/name="p" value="(\d+)"/)[1];
            for(var pre of body.split('<HR>').slice(4,-2)){
                pre = findYouTube(pre);
                pre = findImage(pre);
                pre = replace(pre);
                $('#posts').append('<HR>' + pre);
            }
        });
    });
}

function fetchBBS () {
    const postItem = querystring.stringify({
        pc: pc,
        p: post_id,
        m: 'p',
        k: iconv.encode('あ', 'cp932'),
        c: 100,
        d: 0,
        a: 'checked',
        g: 'checked',
        midokureload: iconv.encode('投稿／リロード', 'cp932')
    });
    const URL = $('[name="bbsurl"] option:selected').val();
    const host = URL.split('/')[2];
    const urlOpts = {
        host: host,
        path: '/cgi-bin/bbs.cgi',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postItem.length
        }
    };

    const req = http.request(urlOpts, function (res) {
        var chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        }).on('error', function (e) {
            console.log('ERROR:' + e.stack);
        });

        res.on('end', (res) => {
            var body = iconv.decode(Buffer.concat(chunks), 'cp932');
            body = body.replace(/<!--[\s\S]*?-->/g, '').replace(/\r\n/g, '\r').replace(/\n/g, '\r');
            body = body.replace(/<A /, '<A target="_blank" ');
            pc = body.match(/name="pc" value="(\d+)"/)[1];
            post_id = body.match(/name="p" value="(\d+)"/)[1];
            for(var pre of body.split('<HR>').slice(4,-2).reverse()){
                pre = replace(pre);
                pre = findYouTube(pre);
                pre = findImage(pre);
                $('#posts').prepend('<HR>' + pre);
            }
        });
    });
    req.write(postItem);
    req.end();
}

function findYouTube(pre) {
    var youtube_id = pre.match(/.youtube.com\/watch\?v=([0-9a-zA-Z_\-]+)/);
    if (youtube_id) {
        pre += '<iframe width="360" height="215" src="https://www.youtube.com/embed/' + youtube_id[1] + '" frameborder="0" allowfullscreen></iframe>';
    } else if (pre.match(/youtu.be\/([0-9a-zA-Z_]+)/)){
        youtube_id = pre.match(/youtu.be\/([0-9a-zA-Z_\-]+)/);
        if (youtube_id){
            pre += '<iframe width="360" height="215" src="https://www.youtube.com/embed/' + youtube_id[1] + '" frameborder="0" allowfullscreen></iframe>';
        }
    }
    return pre;
}

function findImage(pre) {
    let bufArray = [];
    let lines = pre.split('\r');
    for (let i = 0; i < lines.length; i++ ) {
        let misao_id = lines[i].match(/misao.on.arena.ne.jp\/c\/up\/misao([\d]+)\.jpg/);
        if (misao_id) {
            lines[i] = IMG_TEMPLATE + 'http://misao.on.arena.ne.jp/c/up/pixy_misao' + misao_id[1] + '.jpg">' + lines[i];
        } else if (lines[i].match(/pbs.twimg.com\/media\/([0-9a-zA-Z_]+)\.jpg/)) {
            let twimg_id = lines[i].match(/pbs.twimg.com\/media\/([0-9a-zA-Z_]+)\.jpg/);
            if (twimg_id) {
                lines[i] = IMG_TEMPLATE + 'https://pbs.twimg.com/media/' + twimg_id[1] + '.jpg:thumb">' + lines[i];
            }
        } else if (lines[i].match(/twitpic.com\/[0-9a-zA-Z_]+/)) {
            let twitpic = lines[i].match(/twitpic.com\/[0-9a-zA-Z_]+/);
            if (twitpic) {
                lines[i] = IMG_TEMPLATE + 'http://' + twitpic + '">' + lines[i];
            }
        } else if (lines[i].match(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+(jpg|gif|png))/)) {
            let image = lines[i].match(/(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+\.(jpg|gif|png))/);
            if (image) {
                lines[i] = IMG_TEMPLATE + image[1] + '">' + lines[i];
            }
        }
        bufArray.push(lines[i]);
    }
    return bufArray.join('\r');
}

function replace (pre) {
    return pre.replace(/&amp;#(\d+|x[0-9a-fA-F]+);/g, replaceCharacterEntity);
}

function replaceCharacterEntity (str, p1) {
    return String.fromCharCode(p1[0] === 'x' ? parseInt(p1.slice(1), 16) : p1);
}

window.onload = function() {
    initialFetchBBS();
    setInterval(fetchBBS, 10000);
};
