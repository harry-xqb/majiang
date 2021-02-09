const Koa = require('koa')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const websockify = require('koa-websocket');
const exceptionFilter = require('./filter/exception-filter')
const gameLoopTask = require('./tasks/game-loop-task')
const app = websockify(new Koa());
const sessionFilter = require('./filter/session-filter')
// routes
const userController = require('./controller/user-controller')
const roomController = require('./controller/room-controller')
// sockets
const homeSocket = require('./socket/home-socket')
const {httpExceptionFilter} = require("./filter/exception-filter");
// error handler
onerror(app)

// exception handler
app.use(httpExceptionFilter)
// 开启游戏定时检测
gameLoopTask()
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// sockets
app.ws.use(homeSocket.routes());
// session
app.use(sessionFilter)
// routes
app.use(userController.routes(), userController.allowedMethods())
app.use(roomController.routes(), roomController.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
