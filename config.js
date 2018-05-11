const { env } = require("process")

module.exports = {
  PORT: 3000,
  SERVER_HOST: "pinfo-link.fornever.org",
  ...env
}