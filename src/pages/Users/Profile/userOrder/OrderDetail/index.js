import '../../../Cart/Cart.css'
import './OrderDetail.css'
import {AiOutlineRight, AiFillCheckCircle, AiOutlineClose} from 'react-icons/ai'
import {FaBug} from 'react-icons/fa';

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import axios from '../../../../../API/axios';


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
    success: <AiFillCheckCircle />,
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
      <Toasts key={toast.id} {...toast} removeToast={removeToast}/>
    ))}
  </div>
);


function OrderDetail() {
    const src = 'http://localhost:3001/';
    const config = {
        headers: {
          "Content-Type": "application/json"
          },
          withCredentials: true
    }
    const location = useLocation();
    const order_id = location.state ? location.state.order_id : null;
    const [ODItem, setODItem] = useState([]);
    const [orderInfo, setOrderInfo] = useState({});
    const [userName, setUserName] = useState('');
    const [transportFee, setTransportFee] = useState()
    const [confirmCancel, setConfirmCancel] = useState(false)

  //for toast
  const [toasts, setToasts] = useState([]);

  //use for show toast
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };
  const showToast = (event, message_content) => {
    const toastDuration = 2500;
    switch (event) {
      case 'success':
        setToasts((prevToasts) => [
          ...prevToasts,
          { id: Date.now(), header: 'Success', message: message_content, type: 'success', duration: toastDuration },
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
  

    
    useEffect(() => {
        axios.post('/order-detail/order/id/', {order_id: order_id} ,config)
            .then((response) => {
                setODItem(response.data);
            })
            .catch((error) => {
                console.error('Error fetching order detail items:', error);
            });

        axios.post('/order/info/', {id: order_id} ,config)
        .then((response) => {
            setOrderInfo(response.data[0]);
            //console.log('response order info: ', response.data[0]);
        })
        .catch((error) => {
            console.error('Error fetching order info items:', error);
        });

        const getUserInfo = async ()=>{
            const response = await axios.get('/user/id/', config);
            //console.log('user info: ',response.data.user[0].fullname);
            setUserName(response.data.user[0].fullname);
        };
        getUserInfo();
    }, []);
      
    const setStatusDisplay =(status) =>{
        let statusDisplay ='unknown'
        switch (status) {
            case 1:
                statusDisplay = 'processing'
                break;
            case 2:
                statusDisplay = 'confirmed'
                break;
            case 3:
                statusDisplay = 'delivering'
                break;
            case 4:
                statusDisplay = 'completed'
                break;
            case 0:
                statusDisplay = 'canceled'
                break;
            default:
                break;
        }
        return statusDisplay;
    }
    //tính total đơn hàng
    function calculateTotal(ODItem) {
        return ODItem.reduce((total, item) => total + item.total, 0);
      }
    const totalHere = calculateTotal(ODItem);
      
    const handleCancelOrder = ()=>{
        axios.put('/order/cancel/', {id: order_id}, config)
            .then((response)=>{
                if(response.data.status !== 'Error'){
                    //console.log('cancel success');
                    showToast('success', 'Cancel Success')
                }else{
                    //console.log(response.data.message);
                    showToast('error', response.data.message)
                }
            })
        setConfirmCancel(false)
    }

    useEffect(()=>{
        axios.post('/order/info/', {id: order_id} ,config)
        .then((response) => {
            setOrderInfo(response.data[0]);
            setStatusDisplay(response.data[0].status)
            //console.log('response order info: ', response.data[0]);
        })
    }, [handleCancelOrder])

    //modal
    const handleOpenModal = ()=>{
        setConfirmCancel(true)
    }

    const handleCloseModal = ()=>{
        setConfirmCancel(false)
    }
      
    return (
        <>
            <div className="order-detail-page">
                <div className="cart-page-container">
                    <div className='main-nav' style={{marginLeft: 0, marginTop:0}}>
                        <div className='nav-item'>
                            <a href='/user-profile/order'>User Order <AiOutlineRight/></a>
                            <div className='nav-pro-name'>Order Detail</div>
                        </div>
                    </div>
                    <div className="cart-heading">
                        <h1 className="cart-title">Order Detail</h1>
                    </div>
                    <div className="row-cart">
                        <div className="col-md-8">
                            <table className="table table-cart scrollable-table">
                                <tbody>
                                    <tr>
                                        <th className="cart-product">Product</th>
                                        <th className="cart-quant">Quantity</th>
                                        <th className="cart-price">Price</th>
                                    </tr>
                                    {/* map over items and display them */}
                                    {ODItem.map((item, index) => (
                                        <tr key={index} className="cart-item" data-id={item.product_id}>
                                            <td className="cart-product">
                                                <Link to={`/product/detail/${item.product_id}`} className="cart-pro-item">
                                                    <div className="cart-pro-img">
                                                        <img src={src+item.thumbnail} alt="product img"></img>
                                                    </div>
                                                    <div className="cart-pro-info">
                                                        <h3 className="cart-pro-title">{item.title}</h3>
                                                        <p className="cart-pro-size">{item.product_size}</p>
                                                        <p className="cart-pro-unit-price">{item.price} VND</p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="od-quant">
                                                <p>{item.quantity}</p>
                                            </td>
                                            <td className="cart-price">
                                                <h4 className="line-price"><div>{item.total} VND</div></h4>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Link to='/user-profile/order' className="action-btn">
                                <button className="continue-btn">Back To Orders</button>
                            </Link>
                            <div className="action-btn cancel-order-btn" onClick={handleOpenModal}>
                                <button className="continue-btn">Cancel Order</button>
                            </div>
                        </div>
                        <div className="col-md-4 list-info">
                            <div className='cal-total-area'>
                                <div className='cal-container'>
                                    <div className='total-cart'>
                                        <div className='next-checkout od-info-contain'>
                                            <h2>Order Information</h2>
                                            <div className='od-date'>
                                                <div className='od-date-info'>
                                                    <b>Order ID:</b>
                                                    <p>{orderInfo.id}</p>
                                                </div>
                                                <div className='od-date-info'>
                                                    <b>Order Date:</b>
                                                    <p>{orderInfo.order_date}</p>
                                                </div>
                                                <div className='od-date-info od-info-status'>
                                                    <b>Status:</b>
                                                    <p className={`${orderInfo.status === 0 ? 'cancel' : ''} ${(orderInfo.status !== 4 && orderInfo.status !== 0) ? 'notCompleted' : ''}`}>{setStatusDisplay(orderInfo.status)}</p>
                                                </div>
                                                <div className='od-date-info'>
                                                    <b>Order Note: </b>
                                                    <span>{orderInfo.note? orderInfo.note : 'no note'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='next-checkout od-info-contain'>
                                            <h2>Delivery Information</h2>
                                            <div className='od-date'>
                                                <div className='od-date-info'>
                                                    <b>Receiver: </b>
                                                    <span>{orderInfo.receiver}</span>
                                                </div>
                                                <div className='od-date-info'>
                                                    <b>Receiver Phone: </b>
                                                    <span>{orderInfo.receiver_phone}</span>
                                                </div>
                                                <div className='od-date-info'>
                                                    <b>Address: </b>
                                                    <span>{orderInfo.delivery_address}</span>
                                                </div>
                                                <div className='od-date-info'>
                                                    <b>Payment Method:</b>
                                                    <p>{orderInfo.payment_method}</p>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='subtotal od-subtotal'>
                                            Product's Total:
                                            <p>{totalHere} VND</p><br/>
                                            Transport Fee:
                                            <p>{orderInfo.transport_fee}</p><br/><br/>
                                            Total:
                                            <b>{orderInfo.total} VND</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer toasts={toasts} removeToast={removeToast}/>
            <div className={`modal-confirm ${confirmCancel ? '' : 'disNone'}`}>
                <div className='modal-container confirm-container'>
                    <div className='confirm-content'>
                        <span>Please make sure you want to cancel this order?</span>
                    </div>
                    <div className='confirm-access-btn'>
                        <div className='cancel-confirm-btn'>
                            <button onClick={handleCloseModal}>Cancel</button>
                        </div>
                        <div className='accept-confirm-btn'>
                            <button onClick={handleCancelOrder}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderDetail;