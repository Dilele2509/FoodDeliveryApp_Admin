import './SignUp.css';
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

import axios from '../../API/axios';

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

function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
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

  const addUser = async () => {
    try {
      if (fullName === '' || email === '' || password === '' || confirmPassword === '') {
        showToast('warning', 'Need to fill them all out');
        return;
      }

      if (password !== confirmPassword) {
        console.error('Password and Confirm Password does not match');
        showToast('warning', 'Password and Confirm Password do not match');
        return;
      }

      const response = await axios.post('/user/add', {
        role_id: 1, //this is hard code that set default for register be user
        fullname: fullName,
        email: email,
        password: password,
      });

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
        <p className="signUp-heading">Sign Up</p>
        <div className="signUp-input-contain">
          <FaRegUser className="signUp-input-icon" />
          <input
            placeholder="Enter Your Full Name"
            id="username"
            className="signUp-input-field"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="signUp-input-contain">
          <MdOutlineAlternateEmail className="signUp-input-icon" />
          <input
            placeholder="Enter Your Email"
            id="email"
            className="signUp-input-field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="signUp-input-contain">
          <BsFillLockFill className="signUp-input-icon" />
          <input
            placeholder="Enter Your Password"
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
            placeholder="Confirm Your Password"
            id="confirmPass"
            className="signUp-input-field"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="button" id="signUp-button" onClick={addUser}>
          Submit
        </button>
        <div className="login-container">
          <a href="/login">Have an account</a>
        </div>
      </form>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default SignUp;
