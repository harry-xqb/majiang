import React from 'react'
import { Redirect } from "react-router-dom";
import Home from "../page/home";

/**
 *
 * @author  Ta_Mu
 * @date  2020/12/11 10:24
 */
const RouteGuard = ({ children }) => {

  if(!localStorage.getItem('token')) {
    return <Redirect to="/login" />
  }
  return <>
    { children }
  </>
}

export default RouteGuard;
