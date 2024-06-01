import './Login.css';
import '../SignUp/SignUp.css';
import React, { useState, useEffect } from 'react';
import {MdOutlineAlternateEmail} from 'react-icons/md'
import {BsFillLockFill} from 'react-icons/bs'
import {PiWarningCircleFill} from 'react-icons/pi';
import {FaBug} from 'react-icons/fa';
import {AiOutlineClose} from 'react-icons/ai';
import { GoHomeFill } from "react-icons/go";

import axios from '../../API/axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


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

function LoginPage() {
    const [toasts, setToasts] = useState([]);
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

    const handleLogin = async () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        //check rỗng
        if(email ==='' ||password===''){
            showToast('warning', 'Need to fill them all out');
            return;
        }

        //gọi API login từ backend
        const response = await axios.post('/login', { email: email, password: password },config);
        
        //xử lí phản hồi từ API
        if(response.data.status !== 'Error'){
            const userInfo = response.data[0];
            // Redirect to home page
            if(userInfo.deleted !== 1){
              console.log('login successful');
              window.location.href = '/';
            }else{
              showToast('error', 'Your account has been disabled')
            }
        }else if(response.data.problem === 'Email'){
            console.error('Registration failed:', response.data.message);
            showToast('error', response.data.message);
        }else if(response.data.problem === 'Password'){
            console.error('Registration failed:', response.data.message);
            showToast('error', response.data.message);
        }else {
            console.error('Registration failed:', response.data.message);
            showToast('error', response.data.message);
        }
      } catch (error) {
        // Handle login error, show error message, etc.
        console.error('Login failed:', error);
      }
    };

    //forgot pass
    const navigate = useNavigate()
    const handleForgot = () =>{
      const email = document.getElementById('email').value;
      if(email === ''){
        showToast('warning', 'please fill in your email then try again')
      }else{
        axios.post('/login/forgot-sendmail', {
          to: email
        }, config)
        .then((response)=>{
          Cookies.set('email', email);
          console.log('response: ',response);
          navigate('/forgot-pass')
        })
      }
    }
    return ( 
        <>
        <Link to='/' className='back-home-page'><GoHomeFill/></Link>
        <form className="login-form-main" action="">
            <p className="login-heading">Login</p>
            <div className="log-input-contain">
                <MdOutlineAlternateEmail className='log-input-icon'/>
                <input
                    placeholder="Your Email"
                    id="email"
                    className="log-input-field"
                    type="text"
                ></input>
            </div>
            
        <div className="log-input-contain">
            <BsFillLockFill className='log-input-icon'/>
            <input
                    placeholder="Your Password"
                    id="password"
                    className="log-input-field"
                    type="password"
                ></input>
        </div>
        <div className="signUp-container mb-1">
          <a onClick={handleForgot}>Forgot your password?</a>
        </div>                    
                
            <button type='button' id="login-button" onClick={handleLogin}>Submit</button>
        </form>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
     );
}

export default LoginPage;