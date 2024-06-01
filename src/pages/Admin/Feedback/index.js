import './Feedback.css'
import '../Users/User.css'
import '../AdminHome/AdminHome.css'

import axios from '../../../API/axios';
import { useState, useEffect } from 'react';
import { FaPowerOff } from 'react-icons/fa6';

function Feedback() {
    const config = {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      };
      const [fbList, setFbList] = useState([]);
      const [editingFbId, setEditingFbId] = useState(null);
      const [userData, setUserData] = useState({
        id: '',
        fullname: '',
        email: '',
        phone_num: '',
        gender: '', 
        dob: '',
        address: ''
      });
    
      useEffect(() => {
        axios.get('/feedbacks')
          .then((response) => {
            setFbList(response.data);
          })
          .catch((error) => {
            console.error('Error fetching user data', error.message);
          })
      }, []);
    
      const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      };
      
      const handleGenderChange = (e) => {
        const { value } = e.target;
        setUserData((prevData) => ({
          ...prevData,
          gender: value === 'null' ? null : value,
        }));
      };  
    
      const handleEditClick = (userId, user) => {
        // Khi nút "Edit" được nhấn, cập nhật trạng thái editingFbId và userData
        setEditingFbId(userId);
        setUserData(() => ({
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          phone_num: user.phone_num,
          gender: user.gender,
          address: user.address
        }));
      }
    
      const handleSaveClick = (e) => {
        e.preventDefault();
    
        try {
          // Kiểm tra từng ô input, nếu bị trống giữ nguyên giá trị ban đầu từ userData
          const updatedData = {
            id: userData.id || undefined,
            fullname: userData.fullname || undefined,
            email: userData.email || undefined,
            phone_num: userData.phone_num || undefined,
            gender: userData.gender || undefined,
            address: userData.address || undefined
          };
    
          // Gửi yêu cầu PUT để cập nhật thông tin người dùng
            axios.put(`/user/update/`, updatedData, config);
    
          // Update the fbList state with the updated user data
          setFbList(prevfbList => {
            return prevfbList.map(user => {
              if (user.id === userData.id) {
                // Update the specific user data
                return { ...user, ...updatedData };
              }
              return user;
            });
          });
        } catch (error) {
          console.error('update error:', error);
        }
        setEditingFbId(null);
      }
    
      const handleCancelClick = () => {
        setEditingFbId(null);
      }
    
      // thực hiện vô hiệu hoá/tiếp tục hoạt động tài khoản
      const handleToggleUserStatus = (id, user) => {
        let axiosMethod;
        let statusDel;
    
        if (user.deleted !== 1) {
          axiosMethod = axios.put('/user/disable', { id: id });
          statusDel = 'disable';
        } else {
          axiosMethod = axios.put('/user/enable', { id: id });
          statusDel = 'enable';
        }
    
        axiosMethod
          .then((response) => {
            //console.log(`User ${statusDel} successfully:`, response.data);
    
            // Update the fbList state to reflect the change in user status
            setFbList(prevfbList => {
              return prevfbList.map(u => {
                if (u.id === id) {
                  return { ...u, deleted: user.deleted === 1 ? 0 : 1 };
                }
                return u;
              });
            });
          })
          .catch((error) => {
            console.error(`Error ${statusDel} User:`, error);
          });
      };

    return ( 
        <>
            <div className="user-list-container">
                <div className='user-list-item row-item'>
                    <div className='user-list-header'>
                        <div className='user-list-title'>
                        <h3>Feedbacks list</h3>
                        </div>
                    </div>
                    <div className='user-list-content'>
                        <div className='list-table-container'>
                        <table className='table user-list-table'>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th style={{minWidth: "8rem"}}>Product ID</th>
                                <th style={{minWidth: "5rem"}}>User ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Note</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* Map over user list then display them */}
                            {fbList.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <span>{item.id}</span>
                                    </td>
                                    <td>
                                        <span>{item.product_id}</span>
                                    </td>
                                    <td>
                                        <span>{item.user_id}</span>
                                    </td>
                                    <td>
                                        <span>{item.fullname}</span>
                                    </td>
                                    <td>
                                        <span>{item.email}</span>
                                    </td>
                                    <td>
                                        <span>{item.phone_number}</span>
                                    </td>
                                    <td className='long-text-container non-center'>
                                        <span>{item.note}</span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
     );
}

export default Feedback;