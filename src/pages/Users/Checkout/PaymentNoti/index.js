import '../../../SignUp/SignUp.css';
import './PaymentNoti.css'
import React from 'react';
import { GoHomeFill } from "react-icons/go";
import { AiFillCheckCircle } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';


function PaymentNoti() {
    const location = useLocation();
    const order_id = location.state ? location.state.order_id : null;
    return ( 
        <>
        <Link to='/' className='back-home-page'><GoHomeFill/></Link>
        <div className="pay-form-main" action="">
            <h2 className="payment-noti-title">Order Success</h2>
            <div className='payment-noti-contain'>
                <AiFillCheckCircle/>
            </div> 
            <Link to='/user-profile/order/detail' state={{order_id: order_id}} className='pay-btn-container'>
                <button type='button' id="payment-noti-button">Check My Order</button>
            </Link>
            <Link to='/' className='pay-btn-container'>
                <button type='button' id="payment-noti-button">Back To Home Page</button>
            </Link>
        </div>
        </>
     );
}

export default PaymentNoti;