const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const router = require("./router")
const { PORT } = require("../config")

app.use(bodyParser());

app.use(router.routes());

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`)
})