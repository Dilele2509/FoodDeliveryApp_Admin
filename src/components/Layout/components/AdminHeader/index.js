/* import css */
import './AdminHeader.css'

/* import icons */
import {MdOutlineAccountCircle} from 'react-icons/md';
import { IoNotifications } from "react-icons/io5";

import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import axios from '../../../../API/axios';
import { error } from 'jquery';

function AdminHeader() {
  const config = {
    headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true  
}
  const [admin, setAdmin] = useState([])
  useEffect(()=>{
    axios.get('/user/id/', config)
      .then((response)=>{
        setAdmin(response.data.user[0])
        //console.log(response.data.user[0]);
      })
      .catch((error)=>{
        console.log(error.message);
      })
  })
  return (
      <div className='div-header'>
      <div className="admin-header">
        <div className='admin-page-title'>
            <h1>Management Page</h1>
        </div>
        <div className="admin-header-func">
            <Link to='/notification' className='admin-noti-icon'><IoNotifications className='icon-admin-header'/></Link>
            <Link to='/admin-profile' className="icon-link-admin">
                <MdOutlineAccountCircle className="icon-admin-header icon-admin-account" />
                <span className='admin-name'>{admin.fullname}</span>
            </Link>     
        </div>
      </div>
      </div>
  );
}

export default AdminHeader;