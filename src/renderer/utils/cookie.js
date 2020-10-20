/*
 * @Author       : tongzonghua
 * @Date         : 2020-10-21 01:05:41
 * @LastEditors  : tongzonghua
 * @LastEditTime : 2020-10-21 03:00:09
 * @Email        : tongzonghua@360.cn
 * @Description  : 
 * @FilePath     : /cli/aggna-electron-template/src/renderer/utils/cookie.js
 */
import { BASEURL } from 'utils/config'
const session = require("electron").remote.session;
export const setCookie = (name, value, days = 30) => {
  const exp = new Date(),
    date = Math.round(exp.getTime() / 1000) + days * 24 * 60 * 60,
    cookie = {
      url: BASEURL,
      name: name,
      value: value,
      expirationDate: date
    };
  session.defaultSession.cookies.set(cookie, err => {
    if (err) console.error(err);
  });
}

export const getCookie = name => {
  session.defaultSession.cookies.get(
    { url: BASEURL, name },
    (err, cookies) => {
      if (err) console.error(err);
    }
  );
}

export const removeCookie = name => {
  session.defaultSession.cookies.remove(BASEURL, name, err => {
    if (err) console.error(err);
  })
}