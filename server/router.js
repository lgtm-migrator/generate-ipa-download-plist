const Router = require("koa-router")
const router = new Router();
const gen_list = require("../plist").gen_plist
const db = require("./db")

router.get("/:id", async ctx => {
  const { id } = ctx.params;
  ctx.body = db.get(id).value();
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

router.get("/:id/:version", async ctx => {
  const { id, version } = ctx.params;
  const existed = db.get(id).filter({ version: ctx.params.version }).size() > 0;
  if (existed) {
    ctx.type = "text/xml"
    ctx.body = gen_list(db.get(`${ctx.params.id}`).find({ version: ctx.params.version }).value())
  }
})

module.exports = router;