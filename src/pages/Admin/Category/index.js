import React, { useState, useEffect } from 'react';
import axios from '../../../API/axios';
import '../Users/User.css'; // Import CSS file
import './Cat.css';
import { FaPowerOff } from "react-icons/fa6";

function Category() {
  const config = {
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials: true
  };

  const [catList, setCatList] = useState([]);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catData, setCatData] = useState({
    category_id: '',
    category_name: ''
  });

  useEffect(() => {
    axios.get('/categories')
      .then((response) => {
        console.log(response.data.data);
        setCatList(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching cat data', error.message);
      });
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCatData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleEditClick = (catId, cat) => {
    setEditingCatId(catId);
    setCatData(() => ({
      category_id: cat.category_id,
      category_name: cat.category_name
    }));
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        category_id: catData.category_id || undefined,
        category_name: catData.category_name || undefined
      };
      await axios.put(`/category/`, updatedData, config);

      setCatList(prevCatList => {
        return prevCatList.map(cat => {
          if (cat.category_id === catData.category_id) {
            // Update the specific cat data
            return { ...cat, ...updatedData };
          }
          return cat;
        });
      });
    } catch (error) {
      console.error('update error:', error);
    }
    setEditingCatId(null);
  };

  const handleCancelClick = () => {
    setEditingCatId(null);
  };

  // thực hiện vô hiệu hoá/tiếp tục hoạt động tài khoản
  const handleToggleUserStatus = (id, cat) => {
    let axiosMethod;
    let statusDel;

    if (cat.deleted !== 1) {
      axiosMethod = axios.put('/category/disable', { category_id: id });
      statusDel = 'disable';
    } else {
      axiosMethod = axios.put('/category/enable', { category_id: id });
      statusDel = 'enable';
    }

    axiosMethod
      .then((response) => {
        console.log(response.data);
        setCatList(prevCatList => {
          return prevCatList.map(c => {
            if (c.category_id === id) {
              return { ...c, deleted: cat.deleted === 1 ? 0 : 1 };
            }
            return c;
          });
        });
      })
      .catch((error) => {
        console.error(`Error ${statusDel} Category:`, error);
      });
  };

  return (
    <div className='user-list-container'>
      <div className='row-item'>
        <div className='user-list-item'>
          <div className='user-list-header'>
            <div className='user-list-title'>
              <h3>Category list</h3>
            </div>
          </div>
          <div className='user-list-content'>
            <div className='list-table-container'>
              <table className='table user-list-table cat-list'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th></th>
                    {/* <th></th> */}
                  </tr>
                </thead>
                <tbody>
                  {/* Map over cat list then display them */}
                  {catList.map((cat) => (
                    <tr key={cat.category_id}>
                      <td>
                        <span>{cat.category_id}</span>
                      </td>
                      <td>
                        {editingCatId === cat.category_id ? (
                          <>
                            <input
                              type='text'
                              value={catData.category_name}
                              id='category_name'
                              onChange={handleInputChange}
                            />
                          </>
                        ) : (
                          <>
                            <h4>{cat.category_name}</h4>
                          </>
                        )}
                      </td>
                      <td>
                        {editingCatId === cat.category_id ? (
                          <>
                            <button className='edit-list-btn save-list-btn' onClick={handleSaveClick}>Save</button>
                            <button className='edit-list-btn cancel-list-btn' onClick={handleCancelClick}>Cancel</button>
                          </>
                        ) : (
                          <button className='edit-list-btn' onClick={() => handleEditClick(cat.category_id, cat)}>Edit</button>
                        )}
                      </td>
                      <td>
                        <div
                          className={`switch-icon ${cat.deleted == 1 ? 'disable-check' : ''}`}
                          onClick={() => handleToggleUserStatus(cat.category_id, cat)}
                        >
                          <FaPowerOff />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;
