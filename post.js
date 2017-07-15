const http = require('http');
const querystring = require('querystring');

function post(v) {
  var postItem = querystring.stringify({
    pc: pc,
    p: post_id,
    m: 'p',
    k: iconv.encode('あ', 'cp932'),
    c: 100,
    d: 0,
    a: 'checked',
    g: 'checked',
    v: v,
    midokureload: iconv.encode('投稿／リロード', 'cp932')
  });
  var urlOpts = {
    host: 'misao.on.arena.ne.jp',
    path: '/cgi-bin/bbs.cgi',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postItem.length
    }
  };
}
