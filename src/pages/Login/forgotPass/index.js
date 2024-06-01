import '../../SignUp/SignUp.css';
import '../Login.css'
import React, { useState, useEffect } from 'react';
import {BsFillLockFill} from 'react-icons/bs'
import {PiWarningCircleFill} from 'react-icons/pi';
import {FaBug} from 'react-icons/fa';
import {AiOutlineClose} from 'react-icons/ai';
import { GoHomeFill } from "react-icons/go";

import axios from '../../../API/axios';
import { Link, useNavigate } from 'react-router-dom';

const Toasts = ({ id, header, message, type, duration, removeToast }) => {
  useEffect(() => {
    const autoRemove = setTimeout(() => {
      removeToast(id);
    }, duration);

    // Add the 'play' class after a delay
    setTimeout(() => {
      const divToast = document.getElementById(id);
      if (divToast) {
        divToast.classList.add('play');
      }
    }, 500); // Adjust this delay as needed for the fadeOut delay

    return () => {
      clearTimeout(autoRemove);
    };
  }, [duration, id, removeToast]);

  let icons = {
    warning: <PiWarningCircleFill />,
    error: <FaBug />,
  };
  let iconToast = icons[type];

  return (
    <div id={id} className={`toast toast--${type}`}>
      <div className="toast__icon">{iconToast}</div>
      <div className="toast__body">
        <h3 className="toast__header">{header}</h3>
        <p className="toast__message">{message}</p>
      </div>
      <div className="toast__closeBtn">
        <AiOutlineClose />
      </div>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => (
  <div id="toast">
    {toasts.map((toast) => (
      <Toasts key={toast.id} {...toast} removeToast={removeToast} />
    ))}
  </div>
);

function ForgotPass() {
    const [toasts, setToasts] = useState([]);
    const navigate = useNavigate();
    const config = {
      headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true
    }

    //use for toast
    const removeToast = (id) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };
    const showToast = (event, message_content) => {
      const toastDuration = 2500;
      switch (event) {
        case 'warning':
          setToasts((prevToasts) => [
            ...prevToasts,
            { id: Date.now(), header: 'Warning', message: message_content, type: 'warning', duration: toastDuration },
          ]);
          break;
  
        case 'error':
          setToasts((prevToasts) => [
            ...prevToasts,
            { id: Date.now(), header: 'Error', message: message_content, type: 'error', duration: toastDuration },
          ]);
          break;
      }
    };
    useEffect(() => {
      if (toasts.length > 0) {
        const timerId = setTimeout(() => {
          removeToast(toasts[0].id);
        }, toasts[0].duration || 0);
    
        return () => {
          clearTimeout(timerId);
        };
      }
    }, [toasts]);

    const handleCreateNewPass = async () => {
      const code = document.getElementById('confirmCode').value;
      try {
        //check rỗng
        if(code ===''){
            showToast('warning', 'Need to fill them all out');
            return;
        }
        const response = await axios.post('/login/check-code', { inputCode: code },config);
        console.log(response.data);
        if(response.data.status === 'Error'){
            showToast('error', 'Incorrect Confirm Code')
        }else{
            navigate('/reset-pass')
        }
      } catch (error) {
        // Handle login error, show error message, etc.
        console.error('Login failed:', error);
      }
    };
    
    return ( 
        <>
        <Link to='/' className='back-home-page'><GoHomeFill/></Link>
        <form className="login-form-main" action="">
            <p className="login-heading">Enter Confirming Code</p>
            <span className='des-reset-pass'>Please check your email and enter the confirmation code provided to reset your password</span>
            <div className="log-input-contain">
                <BsFillLockFill className='log-input-icon'/>
                <input
                        placeholder="Confirming code"
                        id="confirmCode"
                        className="log-input-field"
                        type="number"
                    ></input>
            </div>                   
                
            <button type='button' id="login-button" onClick={handleCreateNewPass}>Submit</button>
            <div className="signUp-container">
                <a href='/login'>Back to login</a>
            </div>
        </form>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
     );
}

export default ForgotPass;