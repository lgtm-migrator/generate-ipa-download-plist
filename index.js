#!/usr/bin/env node
var { isArray } = require("util")
var { exit, cwd, argv } = require("process")
var readline = require("readline");
var { join } = require("path")
var { readFileSync, writeFileSync, existsSync, openSync } = require("fs")
var cl = readline.createInterface(process.stdin, process.stdout);
var extract = require('ipa-extract-info');
var qr = require("qrcode-terminal")

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

var gen_link = function (url) {
  return `itms-services://?action=download-manifest&url=${url}`
};

(async function main() {
  var ipaFile = argv[2]
  if (!ipaFile) {
    console.error("ipa file losted!")
    exit(1)
  }
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
      var pinfo_link = gen_link(`https://pinfo-link.fornever.org/${opt.id}/${opt.version}`);
      console.log(`link is ${pinfo_link}`)
      qr.generate(pinfo_link)
      exit(0)
    } else {
      console.error("plist invalid!")
      exit(1)
    }

  } else {
    console.error("ipa link is empty!")
    exit(1)
  }
})();
