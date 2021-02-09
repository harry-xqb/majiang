/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
class ResponseModel {

  constructor(data, message, code) {
    this.code = code
    this.message = message;
    this.data = data;
  }

  static ofSuccess(data, message = 'success') {
    return new ResponseModel(data, message, 0)
  }

  static ofFailure(message = 'error') {
    return new ResponseModel(null, message, 500)
  }

  static ofStatus(data, message, code) {
    return new ResponseModel(data, message, code)
  }
}

module.exports = ResponseModel
