const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const db = low(new FileSync('data/app.json'))
const gen_list = require("./plist").gen_plist

router.get("/:id/:version", async ctx => {
  const { id, version } = ctx.params;
  const existed = db.get(id).filter({ version: ctx.params.version }).size() > 0;
  if (existed) {
    ctx.type = "text/xml"
    ctx.body = gen_list(db.get(`${ctx.params.id}`).find({ version: ctx.params.version }).value())
  }
})

router.post("/:id", async ctx => {
  const { id } = ctx.params;
  if (!db.has(id).value()) {
    db.set(id, [])
      .write()
  }
  db.get(id).push(ctx.request.body).write();
  ctx.body = { success: true }
})

app.use(bodyParser());

app.use(router.routes());

app.listen(3000)