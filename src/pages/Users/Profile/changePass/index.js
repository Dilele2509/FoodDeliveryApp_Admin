import { useState, useEffect } from 'react';
import {PiWarningCircleFill} from 'react-icons/pi';
import {FaBug} from 'react-icons/fa';
import {AiOutlineClose} from 'react-icons/ai';
import '../changeInfo/changeInfo.css';
import '../Profile.css';
import axios from '../../../../API/axios';
import { Link, useNavigate } from 'react-router-dom';
import { render } from 'react-dom';



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
    <div id={id} className={`toast toast--${type}`} style={{ top: '110px', position: 'relative' }}>
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


function ChangePass() {
    const [toasts, setToasts] = useState([]);
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    };

    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
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

    const handleSubmit = async () => {
        try {
            const response = await axios.get('/user/id/', config);

            //console.log('User data response:', response.data.user[0].password);
    
            const current = response.data.user[0].password;
            // Check if 'current' is defined before comparing passwords
            if (current === undefined) {
                console.error('Error: Unable to get current password from response');
                return;
            }
    
            // Check current password
            if (currentPass.trim() !== current.trim()) {
                showToast('warning', 'Current password incorrect');
                //console.error('Current password incorrect');
                return;
            } else if (newPass !== confirmPass) {
                showToast('warning', 'Password and Confirm Password do not match')
                //console.error('Password and Confirm Password do not match');
                return;
            }
    
            // Update user password using the API
            axios.put('/user/security/', { password: newPass }, config);
            //console.log('Password update response:', updateResponse.data);
            // Redirect to user-profile after successful password update
            navigate('/user-profile');
        } catch (error) {
            showToast('error', `Error updating password: ${error.message}`)
            //console.error('Error updating password:', error.message);
        }
    };
    

    return (
        <>
            <div className="content-profile-area">
                <form action="" className="form-user-edit">
                    <div className="edit-input-contain">
                        <span>Current Password</span>
                        <input
                            placeholder="Enter your current password"
                            id="currentPass"
                            className="user-pass"
                            type="password"
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                        />
                    </div>
                    <div className="edit-input-contain">
                        <span>New Password</span>
                        <input
                            placeholder="Enter your new password"
                            id="newPass"
                            className="user-new-pass"
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                        />
                    </div>
                    <div className="edit-input-contain">
                        <span>Confirm New Password</span>
                        <input
                            placeholder="Confirm your new password"
                            id="confirmPass"
                            type="password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                        />
                    </div>
                </form>
                <div className="action-edit-btn">
                    <div className="change-user-info">
                        <Link to="/user-profile/">
                            <button className="change-info-btn edit-info-btn">Cancel</button>
                        </Link>
                    </div>
                    <div className="change-user-info">
                        <button className="change-info-btn edit-info-btn save-change-btn" onClick={handleSubmit}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
}

export default ChangePass;
