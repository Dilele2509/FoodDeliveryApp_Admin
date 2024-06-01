import '../../../Users/Cart/Cart.css'
import '../../../Users/Profile/userOrder/OrderDetail/OrderDetail.css'
import {AiOutlineRight} from 'react-icons/ai'

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import axios from '../../../../API/axios';

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
    useEffect(() => {
        console.log(order_id);
        axios.post('/order-detail/manage/', {order_id: order_id} ,config)
        .then((response) => {
            setODItem(response.data);
        })
        .catch((error) => {
            console.error('Error fetching order detail items:', error);
        });
        
        axios.post('/order/info/', {id: order_id} ,config)
        .then((response) => {
            setOrderInfo(response.data[0]);
            console.log('response order info: ', response.data[0]);
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
      
      
    return (
        <>
            <div className="cart-page">
                <div className="cart-page-container">
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
                                                <Link to={'/product'} className="cart-pro-item">
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
                            <a href='/order' className="action-btn">
                                <button className="continue-btn">Back To Orders</button>
                            </a>
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
                                                    <span>{userName}</span>
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
                                            <p>27000 VND</p><br/><br/>
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
        </>
    );
}

export default OrderDetail;