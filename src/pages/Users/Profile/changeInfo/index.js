import './changeInfo.css';
import '../Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../../API/axios';
import React, { useState, useEffect } from 'react';

function ChangeInfo() {
    const navigate = useNavigate();
    const [selectedGender, setSelectedGender] = useState('');
    const [userData, setUserData] = useState({
        fullname: '',
        email: '',
        phone_num: '',
        gender: '', 
        address: ''
    });

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user/id/', config);
                const user = response.data.user[0];

                setUserData({
                    ...user,
                    gender: user.gender || '',
                });

                setSelectedGender(user.gender || '');
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Kiểm tra từng ô input, nếu bị trống giữ nguyên giá trị ban đầu từ userData
            const updatedData = {
                fullname: userData.fullname || undefined,
                email: userData.email || undefined,
                phone_num: userData.phone_num || undefined,
                gender: selectedGender || undefined,
                address: userData.address || undefined
            };

            // Gửi yêu cầu PUT để cập nhật thông tin người dùng
            const response = await axios.put('/user/info/', updatedData, config);

            console.log(response.data);
            navigate('/user-profile');
        } catch (error) {
            console.error('update error:', error);
        }
    };

    return (
        <>
            <div className="content-profile-area">
                <form onSubmit={handleSubmit} className="form-user-edit">
                    <div className="edit-input-contain">
                        <span>Name</span>
                        <input
                            placeholder={userData.fullname}
                            id="fullname"
                            className="edit-user-name"
                            type="text"
                            value={userData.fullname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="edit-input-contain">
                        <span>Email</span>
                        <input
                            style={{color: '#777', pointerEvents: 'none'}}
                            placeholder={userData.email}
                            id="email"
                            className="edit-user-email"
                            type="email"
                            value={userData.email}
                            readOnly={true}
                        />
                    </div>
                    <div className="edit-input-contain">
                        <span>Phone number</span>
                        <input
                            placeholder={userData.phone_num}
                            id="phone_num"
                            className="edit-user-phone"
                            type="phone"
                            value={userData.phone_num}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="edit-input-contain">
                        <span>Gender</span>
                        <div className="radio-container">
                            <div className="radio-wrapper">
                                <label className="radio-button">
                                    <input
                                        id="gender"
                                        name="gender"
                                        type="radio"
                                        value="male"
                                        checked={selectedGender === 'male'}
                                        onChange={(e) => setSelectedGender(e.target.value)}
                                    />
                                    <span className="radio-checkmark"></span>
                                    <span className="radio-label">Male</span>
                                </label>
                            </div>

                            <div className="radio-wrapper">
                                <label className="radio-button">
                                    <input
                                        id="gender"
                                        name="gender"
                                        type="radio"
                                        value="female"
                                        checked={selectedGender === 'female'}
                                        onChange={(e) => setSelectedGender(e.target.value)}
                                    />
                                    <span className="radio-checkmark"></span>
                                    <span className="radio-label">Female</span>
                                </label>
                            </div>

                            <div className="radio-wrapper">
                                <label className="radio-button">
                                    <input
                                        id="gender"
                                        name="gender"
                                        type="radio"
                                        value="other"
                                        checked={selectedGender === 'other'}
                                        onChange={(e) => setSelectedGender(e.target.value)}
                                    />
                                    <span className="radio-checkmark"></span>
                                    <span className="radio-label">Other</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="edit-input-contain">
                        <span>Address</span>
                        <input
                            id="address"
                            className="edit-user-address"
                            type="text"
                            value={userData.address || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="action-edit-btn">
                        <div className="change-user-info">
                            <Link to="/user-profile/">
                                <button className="change-info-btn edit-info-btn">Cancel</button>
                            </Link>
                        </div>
                        <div className="change-user-info">
                            <button type="submit" className="change-info-btn edit-info-btn save-change-btn">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ChangeInfo;
