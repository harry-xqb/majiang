/**
 *
 * @author  Ta_Mu
 * @date 2021/2/7 16:37
 */
const ResponseModel = require("../response/response-model");
const { SYSTEM_ERROR } = require("../response/business-error-constants");
const BusinessError  = require("../response/business-error");

/**
 * http全局请求异常处理
 */
const httpExceptionFilter = async (ctx, next) => {
  try{
    await next()
    if(parseInt(ctx.status) === 404 ) {
      ctx.body = ResponseModel.ofStatus(null, '请求路径不存在', 404)
    }
  }catch (err) {
    console.error("http请求异常：", err)
    ctx.body = exceptionResolve(err)
  }
}
/**
 * socket全局请求异常处理
 */
const socketExceptionFilter = async (ctx, next) => {
  try{
    await next()
  }catch (err) {
    console.error("socket请求异常：", err);
    ctx.websocket.send(JSON.stringify(exceptionResolve(err)))
  }
}

const exceptionResolve = (err) => {
  let message = SYSTEM_ERROR.msg
  let code = SYSTEM_ERROR.code
  if(err instanceof BusinessError) {
    message = err.message
    code = err.code
  }
  return ResponseModel.ofStatus(null, message,  code)
}

module.exports = {
  httpExceptionFilter,
  socketExceptionFilter
}
