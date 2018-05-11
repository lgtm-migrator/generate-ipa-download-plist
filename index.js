#!/usr/bin/env node
var { isArray } = require("util")
var { exit, cwd, argv } = require("process")
var readline = require("readline");
var { join } = require("path")
var { readFileSync, writeFileSync, existsSync, openSync } = require("fs")
var { SERVER_HOST } = require("./config")
var cl = readline.createInterface(process.stdin, process.stdout);
var extract = require('ipa-extract-info');
var qr = require("qrcode-terminal")
var request = require("request")

var question = function (q) {
  return new Promise((res, rej) => {
    cl.question(q, answer => {
      res(answer);
    })
  });
};

var pExtract = function (path) {
  return new Promise((res, rej) => {
    extract(openSync(path, "r"), function (err, info, raw) {
      if (err) {
        rej(err)
      } else {
        res(info)
      }
    });
  });
};

var pRequest = function (url, opt) {
  return new Promise((resolve, reject) => {
    request(url, opt, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
};

var gen_link = function (url) {
  return `itms-services://?action=download-manifest&url=${url}`
};

(async function main() {
  var ipaFile = argv[2]
  if (!ipaFile) {
    console.error("ipa file losted!")
    exit(1)
  }
  try {
    var ipaLink = await question("the ipa download link is: ")
    if (ipaLink) {
      var info = await pExtract(join(__dirname, ipaFile))
      if (isArray(info) && info.length > 0) {
        info = info[0]
        var opt = {
          url: ipaLink,
          id: info.CFBundleIdentifier,
          name: info.CFBundleDisplayName,
          version: info.CFBundleShortVersionString
        };
        var pinfo_link = gen_link(`https://${SERVER_HOST}/${opt.id}/${opt.version}`);
        var res = await pRequest(pinfo_link, { body: opt, json: true })
        console.log(`link is ${pinfo_link}`)
        qr.generate(pinfo_link)
        exit(0)
      } else {
        throw new Error("plist invalid!")
      }
    } else {
      throw new Error("ipa link is empty!")
    }
  } catch (error) {
    console.error(error.message)
    exit(1)
  }
})();
