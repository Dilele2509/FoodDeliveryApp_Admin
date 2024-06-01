import { useEffect, useState } from 'react';
import axios from '../../../API/axios';

import { MdOutlineFileUpload } from "react-icons/md";
import { PiWarningCircleFill } from 'react-icons/pi';
import { FaBug } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import './AdminProfile.css'
import '../../Users/Profile/Profile.css'
import '../Users/User.css'

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
            <Toasts key={toast.user_id} {...toast} removeToast={removeToast} />
        ))}
    </div>
);


function AdminProfile() {
    const [toasts, setToasts] = useState([]);
    const config = {
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true
    };
    const [userAva, setUserAva] = useState('');
    const [uploadAvailable, setUploadAvailable] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [adminInfo, setAdminInfo] = useState({})
    const [editStatus, setEditStatus] = useState(false)
    const [changePass, setChangePass] = useState(false)
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [notiOption, setNotiOptione] = useState('')
    const [notiContent, setNotiContent] = useState()

    //use for toast
    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.user_id !== id));
    };
    const showToast = (event, message_content) => {
        const toastDuration = 2500;
        switch (event) {
            case 'warning':
                setToasts((prevToasts) => [
                    ...prevToasts,
                    { user_id: Date.now(), header: 'Warning', message: message_content, type: 'warning', duration: toastDuration },
                ]);
                break;

            case 'error':
                setToasts((prevToasts) => [
                    ...prevToasts,
                    { user_id: Date.now(), header: 'Error', message: message_content, type: 'error', duration: toastDuration },
                ]);
                break;
        }
    };
    useEffect(() => {
        if (toasts.length > 0) {
            const timerId = setTimeout(() => {
                removeToast(toasts[0].user_id);
            }, toasts[0].duration || 0);

            return () => {
                clearTimeout(timerId);
            };
        }
    }, [toasts]);



    useEffect(() => {
        axios.get('/user/id/', config)
            .then((response) => {
                setAdminInfo(response.data.user[0])
                setUserAva(response.data.user[0].avatar);
                //console.log(response.data.user[0]);
            })
    }, [])

    const handleChangeInfo = () => {
        setEditStatus(true)
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setAdminInfo((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSaveClick = (e) => {
        e.preventDefault();

        try {
            const updatedData = {
                user_id: adminInfo.user_id || undefined,
                full_name: adminInfo.full_name || undefined,
                email: adminInfo.email || undefined,
                phone_num: adminInfo.phone_num || undefined,
                gender: adminInfo.gender || undefined,
                address: adminInfo.address || undefined
            };

            axios.put(`/user/update/`, updatedData, config);
        } catch (error) {
            console.error('update error:', error);
        }
        setEditStatus(false);
    }

    const handleCancelClick = () => {
        setEditStatus(false);
    }

    //changePassword
    const handleChangePass = () => {
        setChangePass(true)
    }

    const handleSavePass = async () => {
        try {
            const response = await axios.get('/user/id/', config);

            const current = response.data.user[0].password;

            if (current === undefined) {
                console.error('Error: Unable to get current password from response');
                return;
            }
            if (currentPass.trim() !== current.trim()) {
                showToast('warning', 'Current password incorrect');
                return;
            } else if (newPass !== confirmPass) {
                showToast('warning', 'Password and Confirm Password do not match')
                return;
            }

            axios.put('/user/security/', { password: newPass }, config);
        } catch (error) {
            showToast('error', `Error updating password: ${error.message}`)
            console.error('Error updating password:', error.message);
        }
        setChangePass(false)
    }
    const handleCancelPass = () => {
        setChangePass(false)
    }

    //for modal
    const handleCancelModal = () => {
        setModalVisible(false);
    }

    const handleOpenModal = (notiOption) => () => {
        setNotiOptione(notiOption)
        setModalVisible(true);
        if (notiOption === 'remove') {
            setNotiContent('You can not access the admin page in the future, but you still login as a normal user')
        } else if (notiOption === 'disable') {
            setNotiContent('Your account will be disabled, you can not login in the future')
        }
    }

    const handleConfirmClick = (id, option) => () => {
        try {
            let axiosMethod = '';
            if (option === 'disable') {
                axiosMethod = 'disable';
            } else if (option === 'remove') {
                axiosMethod = 'remove-admin/';
            }

            console.log(axiosMethod);
            axios.put(`/user/${axiosMethod}`, { user_id: id })
                .then((response) => {
                    console.log('remove res: ', response);
                    axios.get('/logout', config)
                        .then(() => {
                            window.location.href = '/'
                        })
                })
                .catch((error) => {
                    console.error(`Error disable User:`, error);
                });

        } catch (error) {
        }
        setModalVisible(false);
    }

    //use for upload avatar
    //turn on upload mode
    const handleUploadStatus = () => {
        setUploadAvailable(true);
    }

    const fileSelectedHandler = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        //console.log("file: ", file);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setUserAva(reader.result);
        };
    };

    const fileUploadHandler = async () => {
        try {
            if (!selectedFile) {
                console.log("No file selected.");
                return;
            }

            const formData = new FormData();
            formData.append('avatar', selectedFile);
            formData.append('user_id', adminInfo.user_id)

            //console.log("form: ", formData);

            const response = await axios.post('/user/avatarAdmin/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 && response.data.user && response.data.user.length > 0) {
                axios.get('/user/id/', config)
                    .then((response) => {
                        setAdminInfo(response.data.user[0])
                        setUserAva(response.data.user[0].avatar);
                        //console.log(response.data.user[0]);
                    })
                setUploadAvailable(false)

            } else {
                console.log("Failed to upload file or user data not available.");
                console.log("Server Response:", response);
            }
        } catch (error) {
            console.log("Error uploading file:", error.message);
            console.error("Error:", error);
        }
    };





    const handleCancelUpload = () => {
        setUploadAvailable(false)
    }
    return (
        <>
            <div className='admin-profile-container'>
                <div className='admin-list-item'>
                    <div className='user-list-header'>
                        <div className='user-list-title'>
                            <h3>{adminInfo.full_name}'s Profile</h3>
                        </div>
                    </div>
                    <div className='user-list-content admin-profile-content'>
                        <div className='admin-avatar-area'>
                            <img src={userAva} alt='admin-avatar' />
                            <div className='change-user-ava'>
                                {uploadAvailable ? (
                                    <>
                                        <div className='change-ava-area'>
                                            <div className='upload-file-container'>
                                                <label htmlFor='file-upload'>Input File <MdOutlineFileUpload className='upload-icon' /></label>
                                                <input id='file-upload' type="file" accept=".png, .jpg, .jpeg" onChange={fileSelectedHandler} />
                                            </div>
                                            <button className='change-ava-btn' onClick={fileUploadHandler}>Upload</button>
                                            <button className='change-ava-btn cancel-mod' onClick={handleCancelUpload}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <button className='change-ava-btn' onClick={handleUploadStatus}>Change</button>
                                )}
                            </div>
                            <div className='admin-security-area'>
                                <div className='admin-security-header'>
                                    <h3>Security</h3>
                                    {changePass ? (
                                        <>
                                            <div className='admin-submit-btn submit-change-pass'>
                                                <button className='edit-list-btn save-list-btn' onClick={handleSavePass}>Save</button>
                                                <button className='edit-list-btn cancel-list-btn' onClick={handleCancelPass}>Cancel</button>
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className='security-edit-option'>
                                    {changePass ? (
                                        <>
                                            <div className="edit-input-contain">
                                                <h4>Current Password</h4>
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
                                                <h4>New Password</h4>
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
                                                <h4>Confirm New Password</h4>
                                                <input
                                                    placeholder="Confirm your new password"
                                                    id="confirmPass"
                                                    type="password"
                                                    value={confirmPass}
                                                    onChange={(e) => setConfirmPass(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className='admin-edit-security' onClick={handleChangePass}>
                                                Change Account Password
                                            </span><br />
                                            <span className='admin-edit-security' onClick={handleOpenModal('remove')}>
                                                Remove Admin to User
                                            </span><br />
                                            <span className='admin-edit-security' onClick={handleOpenModal('disable')}>
                                                Disable Account
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='admin-profile-info'>
                            <div className='admin-info-welcome'>
                                <h3>Hi, {adminInfo.full_name}!</h3>
                                <p>This is admin profile page, you can change your information or your security here</p>
                            </div>
                            <div className='admin-info-form'>
                                <div className='admin-info-title'>
                                    <h3>Account Information</h3>
                                    <div className='change-user-info admin-edit-btn'>
                                        {editStatus ? (
                                            <>
                                                <div className='admin-submit-btn'>
                                                    <button className='edit-list-btn save-list-btn' onClick={handleSaveClick}>Save</button>
                                                    <button className='edit-list-btn cancel-list-btn' onClick={handleCancelClick}>Cancel</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <button className='change-info-btn' onClick={handleChangeInfo}>Change</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className='admin-info-area'>
                                    {editStatus ? (
                                        <>
                                            <input
                                                type='text'
                                                value={adminInfo.full_name}
                                                id='full_name'
                                                onChange={handleInputChange}
                                            /><br />
                                            <input
                                                type='text'
                                                id='email'
                                                value={adminInfo.email}
                                                onChange={handleInputChange}
                                            />
                                            <input
                                                type='text'
                                                id='phone_num'
                                                value={adminInfo.phone_num}
                                                onChange={handleInputChange}
                                            />
                                            <input
                                                type='text'
                                                id='address'
                                                value={adminInfo.address}
                                                onChange={handleInputChange}
                                            />
                                        </>) : (
                                        <>
                                            <span>Name: {adminInfo.full_name}</span>
                                            <span typeof='email'>Email: {adminInfo.email}</span>
                                            <span typeof='phone'>Phone: {adminInfo.phone_num}</span>
                                            <span>Address: {adminInfo.address}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* modal confirm */}
            <div className={`modal-add ${isModalVisible ? 'modal-visible' : 'modal-hidden'}`}>
                <div className='modal-container'>
                    <div className='modal-header'>
                        <h3>Confirm your Action</h3>
                    </div>
                    <div className='modal-content'>
                        <div className='modal-input-area'>
                            <span className='noti-modal-content'>
                                {notiContent}
                            </span>
                        </div>
                        <div className='access-modal-button'>
                            <button className='submit-modal-btn' onClick={handleConfirmClick(adminInfo.user_id, notiOption)}>Confirm</button>
                        </div>
                        <div className='cancel-modal-button'>
                            <button className='submit-modal-btn modal-cancel' onClick={handleCancelModal}>CANCEL</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
}

export default AdminProfile;