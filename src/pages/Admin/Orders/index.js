import React, { useState, useEffect } from 'react';
import axios from '../../../API/axios';
import { Link } from 'react-router-dom';
import '../Users/User.css'; // Import CSS file
import '../Category/Cat.css';
import './Order.css'
import { MdCancel } from 'react-icons/md'

function Orders() {
  const config = {
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials: true
  };

  const [orderList, setOrderList] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderData, setOrderData] = useState({
    id: null,
    status: null,
  });

  useEffect(() => {
    axios.get('/orders')
      .then((response) => {
        //console.log(response.data);
        setOrderList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching order data', error.message);
      });
  }, []);

  const setStatusDisplay = (status) => {
    let statusDisplay = 'unknown'
    switch (status) {
      case 1:
        statusDisplay = 'Pending'
        break;
      case 2:
        statusDisplay = 'Shipping'
        break;
      case 3:
        statusDisplay = 'Completed'
        break;
      case 0:
        statusDisplay = 'Canceled'
        break;
      default:
        break;
    }
    return statusDisplay;
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleEditClick = (orderId, status) => {
    setEditingOrderId(orderId);
    setOrderData(() => ({
      id: orderId, 
      status: status,
    }));
  }
  

  const handleSaveClick = async (e) => {
    e.preventDefault();

    try {
      // Validate that all necessary fields are included
      if (!orderData.status) {
        throw new Error("Missing required fields");
      }

      const updatedData = {
        order_id: orderData.id, // Make sure this matches the expected field name on the server
        status: Number(orderData.status), // Convert to number
      };
      //console.log("status: ", updatedData.status);
      //console.log('Update data: ', updatedData);

      // Make the PUT request to update the order
      const response = await axios.put(`/order/update/`, updatedData, config);
      console.log('Server response:', response.data);

      // Update the local state with the new order data
      setOrderList(prevOrderList => {
        return prevOrderList.map(order => {
          if (order.order_id === orderData.id) {
            return { ...order, ...updatedData };
          }
          return order;
        });
      });
    } catch (error) {
      console.error('Update error:', error);
      // Handle the error (e.g., display a notification to the user)
    }
    setEditingOrderId(null);
  }


  const handleCancelClick = () => {
    setEditingOrderId(null);
  }

  const handleDelOrder = (id) => {
    axios.put('/order/cancel/', { id: id })
      .then((response) => {
        console.log(`Order cancelled successfully:`, response.data);

        setOrderList(prevOrderList => {
          return prevOrderList.map(order => {
            if (order.order_id === id) {
              return { ...order, status: 0 };
            }
            return order;
          });
        });
      })
      .catch((error) => {
        console.error(`Error cancelling order:`, error);
      });
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      status: value === 'null' ? null : value,
    }));
  }; 

  return (
    <div className='user-list-container'>
      <div className='row-item'>
        <div className='user-list-item'>
          <div className='user-list-header'>
            <div className='user-list-title'>
              <h3>Order list</h3>
            </div>
          </div>
          <div className='user-list-content'>
            <div className='list-table-container'>
              <table className='table user-list-table cat-list'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th style={{ minWidth: "5rem" }}>User ID</th>
                    <th style={{ minWidth: "5rem" }}>Receivers</th>
                    <th style={{ minWidth: "7rem" }}>Phone</th>
                    <th>Delivery Address</th>
                    <th style={{ minWidth: "15rem" }}>Order Date</th>
                    <th style={{ minWidth: "15rem", textAlign: "center" }}>Note</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map over user list then display them */}
                  {orderList.map((order) => (
                    <tr key={order.order_id}>
                      <td>
                        <Link to={'/order/detail'} state={{ order_id: order.order_id }}>
                          <b>{order.order_id}</b>
                        </Link>
                      </td>
                      <td>
                        <h4>{order.user_id}</h4>
                      </td>
                      <td>
                        <h4>{order.receiver}</h4>
                      </td>
                      <td>
                        <span>{order.receiver_phone}</span>
                      </td>
                      <td className='long-text-container'>
                        <span>{order.delivery_address}</span>
                      </td>
                      <td>
                        <span>{order.order_date}</span>
                      </td>
                      <td className='note long-text-container non-center'>
                        <span>{order.note}</span>
                      </td>
                      <td>
                        <span>{order.payment_method}</span>
                      </td>
                      <td>
                        {editingOrderId === order.order_id ? (
                          <>
                            <select
                              value={orderData.status !== null ? orderData.status : 'null'}
                              onChange={(e) => {
                                handleStatusChange(e);
                                handleInputChange(e);
                              }}
                            >
                              <option value='null'>Select Status</option>
                              <option value={1}>Pending</option>
                              <option value={2}>Shipping</option>
                              <option value={3}>Completed</option>
                              <option value={0}>Cancel</option>
                            </select>
                          </>
                        ) : (
                          <>
                            <h4>{setStatusDisplay(order.status)}</h4>
                          </>
                        )}
                      </td>
                      <td>
                        <h4>{order.total} VND</h4>
                      </td>
                      <td>
                        {editingOrderId === order.order_id ? (
                          <>
                            <button className='edit-list-btn save-list-btn' onClick={handleSaveClick}>Save</button>
                            <button className='edit-list-btn cancel-list-btn' onClick={handleCancelClick}>Cancel</button>
                          </>
                        ) : (
                          <button className='edit-list-btn' onClick={() => handleEditClick(order.order_id, order.status)}>Edit</button>
                        )}
                      </td>
                      <td>
                        <div
                          className='switch-icon disable-check'
                          onClick={() => handleDelOrder(order.order_id)}
                        >
                          <MdCancel />
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

export default Orders;
