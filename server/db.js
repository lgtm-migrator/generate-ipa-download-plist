const { join } = require("path")
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = low(new FileSync(join(__dirname, '../data/app.json')))

module.exports = db;