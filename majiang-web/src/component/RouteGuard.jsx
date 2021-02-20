import React from 'react'
import {Redirect} from "react-router-dom";
import {getToken} from "../util/token-util";

/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const RouteGuard = ({ children }) => {

  if(!getToken()) {
    return <Redirect to="/login" />
  }
  return <>
    { children }
  </>
}

export default RouteGuard;
