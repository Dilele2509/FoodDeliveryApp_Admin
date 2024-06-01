import '../../SignUp/SignUp.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { BsFillLockFill, BsShieldLockFill } from 'react-icons/bs';
import { PiWarningCircleFill } from 'react-icons/pi';
import { FaBug } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { GoHomeFill } from 'react-icons/go';

import axios from '../../../API/axios';
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

function ResetPass() {
  const [email] = useState(Cookies.get('email'));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

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

    const HandleResetPassword = async () => {
        try {
        if (password === '' || confirmPassword === '') {
            showToast('warning', 'Need to fill them all out');
            return;
        }

        if (password !== confirmPassword) {
            console.error('Password and Confirm Password does not match');
            showToast('warning', 'Password and Confirm Password do not match');
            return;
        }

        const response = await axios.put('/user/reset/', {
            email: email,
            password: password,
        });
        Cookies.remove('email');
        if (response.data.status !== 'Error') {
            navigate('/login');
        } else {
            showToast('error', response.data.message);
        }
        } catch (error) {
        console.error('Registration failed:', error);
        }
    };

  return (
    <>
      <Link to="/" className="back-home-page">
        <GoHomeFill />
      </Link>
      <form className="signUp-form-main" action="">
        <p className="signUp-heading">Reset Password</p>

        <div className="signUp-input-contain">
          <BsFillLockFill className="signUp-input-icon" />
          <input
            placeholder="Enter Your New Password"
            id="password"
            className="signUp-input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="signUp-input-contain">
          <BsShieldLockFill className="signUp-input-icon" />
          <input
            placeholder="Confirm Your New Password"
            id="confirmPass"
            className="signUp-input-field"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="button" id="signUp-button" onClick={HandleResetPassword}>
          Submit
        </button>
        <div className="login-container">
          <a href="/login">Back to login</a>
        </div>
      </form>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default ResetPass;
