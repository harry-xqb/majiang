import React, { useState } from 'react'
import { Form, Input, Button } from 'antd';
import { useHistory } from "react-router-dom";
import http from '../../util/http'
import {setToken} from "../../util/token-util";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
/**
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const Login = (props) => {

  let history = useHistory();

  const [loading, setLoading] = useState(false)

  const handleFinish = async (values) => {
    setLoading(true)
    const { success, data } = await http.post('/user/login', {data: values})
    setLoading(false)
    if(success) {
      setToken(data.token)
      history.push('/home')
    }
  }

  return (
    <div className='flex-container-col' style={{alignItems: 'center', top: 250}}>
      <Form
        {...layout}
        onFinish={handleFinish}
        style={{marginLeft: -100}}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input style={{width: 200}}/>
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password style={{width: 200}}/>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login;
