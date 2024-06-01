import React, { useState, useEffect } from 'react';
import axios from '../../../API/axios';
import '../Users/User.css'; // Import CSS file
import './Product.css';
import { FaPowerOff } from "react-icons/fa6";
import { IoAdd } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";

function Product() {
  const src = 'http://localhost:3001/';
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
  const [productImg, setProductImg] = useState('public/assets/images/default_pro_img.jpeg');
  const [isModalVisible, setModalVisible] = useState(false);
  const [proList, setProList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [editingProId, setEditingProId] = useState(null);
  const [addData, setAddData] = useState({
    category_id: '',
    title: '',
    price: '',
    ingredients: '',
    thumbnail: '',
    description: '',
    quantity: '',
  })
  const [proData, setProData] = useState({
    product_id: '',
    category_id: '',
    title: '',
    price: '',
    ingredients: '',
    thumbnail: '',
    description: '',
    quantity: '',
    deleted: '',
    sold: ''
  });

  useEffect(() => {
    axios.get('/products')
      .then((response) => {
        setProList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product data', error.message);
      })

    axios.get('/categories')
      .then((response) => {
        console.log(response.data.data);
        setCatList(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching product data', error.message);
      })
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleAddChange = (e) => {
    const { id, value, type } = e.target;

    if (type === 'file') {
      const file = e.target.files[0];
      previewFile(file);
      setAddData({
        ...addData,
        thumbnail: file
      });
    } else {
      setAddData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProductImg(reader.result);
    };
  };

  const handleEditClick = (proId, pro) => {
    setEditingProId(proId);
    setProData(() => ({
      product_id: pro.product_id,
      category_id: pro.category_id,
      title: pro.title,
      ingredients: pro.ingredients,
      thumbnail: pro.thumbnail,
      description: pro.description,
      price: pro.price,
      quantity: pro.quantity,
      deleted: pro.deleted,
      sold: pro.sold
    }));
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        product_id: proData.product_id,
        category_id: proData.category_id,
        title: proData.title,
        price: proData.price,
        ingredients: proData.ingredients,
        description: proData.description,
        quantity: proData.quantity,
      };

      const response = await axios.put('/product/update/', updatedData, config);
      if (response.status === 200) {
        setProList((prevProList) => {
          return prevProList.map((pro) => {
            if (pro.product_id === proData.product_id) {
              return { ...pro, ...response.data.updated };
            }
            return pro;
          });
        });
      } else {
        console.error('Update request failed:', response);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
    setEditingProId(null);
  };

  const handleCancelClick = () => {
    setEditingProId(null);
  };

  const handleAddClick = async (e) => {
    e.preventDefault();
    const addedData = new FormData();

    addedData.append('category_id', addData.category_id);
    addedData.append('title', addData.title);
    addedData.append('price', addData.price);
    addedData.append('ingredients', addData.ingredients);
    addedData.append('thumbnail', addData.thumbnail);
    addedData.append('description', addData.description);
    addedData.append('quantity', addData.quantity);
    addedData.append('sold', 0);

    //console.log("thumbnail: ", addData.thumbnail);
    console.log("added: ", addedData);
    try {
      const response = await axios.post('/product/add', addedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      if (response.status === 200) {
        console.log(response.data);
        const updatedResponse = await axios.get('/products');
        setProList(updatedResponse.data);
      } else {
        console.error('Add request failed:', response);
      }
    } catch (error) {
      console.error('Add error:', error);
    }
    setModalVisible(false);
  };

  const handleCancelModal = () => {
    setProductImg('public/assets/images/default_pro_img.jpeg');
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleToggleProStatus = (id, pro) => {
    let axiosMethod;
    let statusDel;

    if (pro.deleted !== 1) {
      axiosMethod = axios.put('/product/disable/', { product_id: id });
      statusDel = 'disable';
    } else {
      axiosMethod = axios.put('/product/enable/', { product_id: id });
      statusDel = 'enable';
    }

    axiosMethod
      .then((response) => {
        setProList(prevProList => {
          return prevProList.map(p => {
            if (p.product_id === id) {
              return { ...p, deleted: pro.deleted === 1 ? 0 : 1 };
            }
            return p;
          });
        });
      })
      .catch((error) => {
        console.error(`Error ${statusDel} Product:`, error);
      });
  };

  const handleCatChange = (e) => {
    const { value } = e.target;
    setProData((prevData) => ({
      ...prevData,
      category_id: value === 'null' ? null : value,
    }));
    console.log('value: ', value);
  };

  return (
    <>
      <div className='user-list-container'>
        <div className='row-item'>
          <div className='user-list-item'>
            <div className='user-list-header'>
              <div className='user-list-title'>
                <h3>Product list</h3>
              </div>
            </div>
            <div className='user-list-content'>
              <div className='add-product-btn' onClick={handleOpenModal}>
                <IoAdd /> Add more product
              </div>
              <div className='list-table-container'>
                <table className='table user-list-table'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Information</th>
                      <th>Description</th>
                      <th>Ingredients</th>
                      <th>Thumbnail</th>
                      <th>Quantity</th>
                      <th className='large-space'>Sold</th>
                      <th className='large-space'>Deleted</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {proList.map((pro) => (
                      <tr key={pro.product_id}>
                        <td>
                          <span>{pro.product_id}</span>
                        </td>
                        <td className='info-long-text'>
                          <div className='td-contain-info'>
                            <div className='user-img-list pro-img-list'>
                              <img src={pro.thumbnail} alt='pro-img' />
                            </div>
                            <div className='user-info-list'>
                              {editingProId === pro.product_id ? (
                                <>
                                  <input
                                    type='text'
                                    value={proData.title}
                                    id='title'
                                    onChange={handleInputChange}
                                  /><br />
                                  <input
                                    type='text'
                                    value={proData.category_id}
                                    id='category_id'
                                    onChange={handleInputChange}
                                  /><br />
                                  <input
                                    type='text'
                                    id='price'
                                    value={proData.price}
                                    onChange={handleInputChange}
                                  />
                                </>
                              ) : (
                                <>
                                  <h4>{pro.title}</h4>
                                  <span>Category_id: {pro.category_id}</span><br />
                                  <span>{pro.price} VND</span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className='long-text-container'>
                          {editingProId === pro.product_id ? (
                            <input
                              type='text'
                              value={proData.description}
                              id='description'
                              onChange={handleInputChange}
                            />
                          ) : (
                            <span>{pro.description}</span>
                          )}
                        </td>
                        <td className='long-text-container'>
                          {editingProId === pro.product_id ? (
                            <input
                              type='text'
                              value={proData.ingredients}
                              id='ingredients'
                              onChange={handleInputChange}
                            />
                          ) : (
                            <span>{pro.ingredients}</span>
                          )}
                        </td>
                        <td className='long-text-container'>
                          {editingProId === pro.product_id ? (
                            <input
                              type='text'
                              value={proData.thumbnail}
                              id='thumbnail'
                              onChange={handleInputChange}
                            />
                          ) : (
                            <span>{pro.thumbnail}</span>
                          )}
                        </td>
                        <td>
                          {editingProId === pro.product_id ? (
                            <input
                              type='text'
                              value={proData.quantity}
                              id='quantity'
                              onChange={handleInputChange}
                            />
                          ) : (
                            <span>{pro.quantity}</span>
                          )}
                        </td>
                        <td >
                          <span>{pro.sold}</span>
                        </td>
                        <td>
                          <span>{pro.deleted}</span>
                        </td>
                        <td>
                          {editingProId === pro.product_id ? (
                            <>
                              <button className='edit-list-btn save-list-btn' onClick={handleSaveClick}>Save</button>
                              <button className='edit-list-btn cancel-list-btn' onClick={handleCancelClick}>Cancel</button>
                            </>
                          ) : (
                            <button className='edit-list-btn' onClick={() => handleEditClick(pro.product_id, pro)}>Edit</button>
                          )}
                        </td>
                        <td>
                          <div
                            className={`switch-icon ${pro.deleted === 1 ? 'disable-check' : ''}`}
                            onClick={() => handleToggleProStatus(pro.product_id, pro)}
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
      {/* modal add */}
      <div className={`modal-add ${isModalVisible ? 'modal-visible' : 'modal-hidden'}`}>
        <div className='modal-container'>
          <div className='modal-header'>
            <h3>ADD PRODUCT</h3>
          </div>
          <div className='modal-content'>
            <div className='modal-input-area'>
              <div className='upload-product-img change-ava-area'>
                <div className='default-img'>
                  <img src={productImg} alt='default-product-img' />
                </div>
                <div className='upload-file-container'>
                  <label htmlFor='file-upload'>Input File <MdOutlineFileUpload className='upload-icon' /></label>
                  <input id='thumbnail' type="file" accept=".png, .jpg, .jpeg" onChange={handleAddChange} />
                </div>
              </div>
              <input
                type='text'
                placeholder='Product title'
                id='title'
                onChange={handleAddChange}
              />
              <select
                value={proData.category_id !== null ? proData.category_id : 'null'}
                onChange={(e) => {
                  handleCatChange(e);
                  handleInputChange(e);
                }}
              >
                <option value='null'>Select Category</option>
                {catList.map((cat) => (
                  cat.deleted != 1 && (
                    <>
                      <option value={cat.category_id}>{cat.category_name}</option>
                    </>
                  )
                ))}
              </select>
              <input
                type='text'
                placeholder='Price'
                id='price'
                onChange={handleAddChange}
              />
              <input
                type='text'
                placeholder='Description'
                id='description'
                onChange={handleAddChange}
              />
              <input
                type='text'
                placeholder='Ingredients'
                id='ingredients'
                onChange={handleAddChange}
              />
              <input
                type='text'
                placeholder='Quantity in stock'
                id='quantity'
                onChange={handleAddChange}
              />
            </div>
            <div className='access-modal-button'>
              <button className='submit-modal-btn' onClick={handleAddClick}>ADD</button>
            </div>
            <div className='cancel-modal-button'>
              <button className='submit-modal-btn modal-cancel' onClick={handleCancelModal}>CANCEL</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
