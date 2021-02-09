/**
 * BusinessError 业务异常，最外层捕获
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
class BusinessError extends Error{
    constructor(msg, code = 500) {
      super(msg);
      this.message = msg;
      this.code = code;
    }

    static ofStatus(errorObj) {
      return new BusinessError(errorObj.msg, errorObj.code)
    }
}

module.exports = BusinessError