import './checkout.css'
import '../Product_Details/Product_details.css'
import '../Cart/Cart.css'

import {SelectCityDistrict} from '../../../components/Method'

import { AiOutlineRight, AiOutlineClose} from 'react-icons/ai';
import {FaBug} from 'react-icons/fa';
import {PiWarningCircleFill} from 'react-icons/pi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../../API/axios';
import React, { useState, useEffect } from 'react';
import eventEmitter from '../util/EventEmitter';


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
      <Toasts key={toast.id} {...toast} removeToast={removeToast}/>
    ))}
  </div>
);

function Checkout() {
    const src = 'http://localhost:3001/';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    };
    const navigate = useNavigate();
    const [cityAddress, setCityAddress] = useState({
        city: '',
        district: '',
        districtID: '',
        ward: '',
        wardCode: ''
    });
    const [payMethod, setPayMethod] = useState('');
    //for main content
    const [userData, setUserData] = useState({
        fullname: '',
        phone_num: '',
        address: ''
    });

    //use for get city, district and ward value
    useEffect(() => {
        const updateCityAddress = (address) => {
          setCityAddress(address);
        };
    
        // Listen for the 'updateCartLength' event
        eventEmitter.on('updateCityAddress', updateCityAddress);
    
        // Cleanup the event listener when the component unmounts
        return () => {
          eventEmitter.off('updateCityAddress', updateCityAddress);
        };
      }, []); 

    //use for fetch data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user/id/', config);
                const user = response.data.user[0];

                setUserData({
                    ...user
                })
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);


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

        case 'warning':
            setToasts((prevToasts) => [
            ...prevToasts,
            { id: Date.now(), header: 'Waring', message: message_content, type: 'warning', duration: toastDuration },
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
        const timerId = setTimeout(() => {
            if (toasts.length > 0) {
                removeToast(toasts[0].id); 
            }
        }, toasts.length > 0 ? toasts[0].duration : 0);
    
        return () => {
            clearTimeout(timerId);
        };
    }, [toasts]);
    


    
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handlePayMethodChange = (e) => {
        setPayMethod(e.target.value);
    };

    //for bill content
    const location = useLocation();
    const note = location.state ? location.state.note : null;
    const total = location.state ? location.state.total : null;
    const [transportFee, setTransportFee] = useState(0);
    const totalBill = total + transportFee;
    
    const [billItem, setBillItem] = useState([]);
    useEffect(() => {
        // Gọi API để lấy danh sách sản phẩm trong giỏ hàng và gán vào cartItem
        axios.get('/order-detail/id/', config)
            .then((response) => {
                setBillItem(response.data);
            })
            .catch((error) => {
                console.error('Error fetching cart items:', error);
            });
    }, []);

    //use for calculate transport fee
    const configAPI ={
        headers: {
            'Content-Type': 'application/json',
            'token': '10b95f73-8fad-11ee-af43-6ead57e9219a',
        },
    }
    useEffect(() => {
        const calculateTransportFee = async () => {
            if (cityAddress.city !== '' && cityAddress.district !== '' && cityAddress.ward !== '' && payMethod !== '') {
                try {
                    const response = await axios.get(
                        'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                        {
                            params: {
                                "service_type_id": 2,
                                "insurance_value": total,
                                "coupon": null,
                                "from_district_id": 3695, //thu duc city
                                "to_district_id": parseInt(cityAddress.districtID, 10),
                                "to_ward_code": cityAddress.wardCode,
                                "height": 15,
                                "length": 15,
                                "weight": 1000,
                                "width": 10
                            },
                            headers: configAPI.headers,
                        }
                    );
                    //console.log('shipping fee: ',response.data.data.total);
                    setTransportFee(response.data.data.total);
                } catch (error) {
                    console.error('Error calculating transport fee:', error);
                }
            }
        };
        calculateTransportFee()
    }, [cityAddress, total, configAPI.headers]); 

    //payment func
    const handlePay = async () => {
        try {
        if(cityAddress.city === '' || cityAddress.district === '' || cityAddress.ward === '' || payMethod === '') {
            showToast('warning', 'please fill in all information')
        }else{
            {const deliAddress = `${userData.address}, ${cityAddress.ward}, ${cityAddress.district}, ${cityAddress.city}`;
            const response = await axios.post('/order/add/', {
                receiver: userData.fullname,
                receiver_phone: userData.phone_num,
                note: note,
                delivery_address: deliAddress,
                payment_method: payMethod,
                transport_fee: transportFee,
                total: totalBill
            }, config);
        
            if (response.data.status === 'Error') {
              showToast('error', response.data.message);
            } else {
              navigate('/pay-noti', { state: { order_id: response.data.insertResponse[0].id } });
            }}
        }
        } catch (error) {
          console.log('Error in Axios request:', error);
        }
      };
      
      
    return ( 
        <>
            <div className='body-container-checkout'>
                <div className='checkout-container'>
                    <div className='main-contain'>
                        <div className='main-nav'>
                            <h1>Checkout</h1>
                            <div className='nav-item'>
                            <a href='/cart'>Cart <AiOutlineRight/></a>
                            <div className='nav-pro-name'>Checkout</div>
                            </div>
                        </div>
                        <div className='main-content'>
                            <div className='content-main-checkout fill-checkout'>
                                <div className='main-checkout-content-header'>
                                    <h2>Shipment Detail</h2>
                                </div>
                                <div className='main-checkout-content'>
                                    <Link to='/user-profile' className='user-info-content'>
                                        <div className='user-img-content'>
                                            <img src='/assets/images/default_user_ava.png' alt='user-ava'></img>
                                        </div>
                                        <div className='user-detail-content'>
                                            <span>({userData.email})</span>
                                        </div>
                                    </Link>
                                    <div className='fill-info-shipment'>
                                        <form /*</div>onSubmit={handleSubmit}*/ className="form-user-edit">
                                            <div className="edit-input-contain">
                                                <input
                                                    placeholder='Recipient name'
                                                    id="fullname"
                                                    className="edit-user-name"
                                                    type="text"
                                                    value={userData.fullname}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="edit-input-contain">
                                                <input
                                                    placeholder='Phone Number'
                                                    id="phone_num"
                                                    className="edit-user-phone"
                                                    type="phone"
                                                    value={userData.phone_num}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="edit-input-contain">
                                                <input
                                                    placeholder='Address'
                                                    id="address"
                                                    className="edit-user-address"
                                                    type="text"
                                                    value={userData.address || ''}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <SelectCityDistrict/>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className='pay-method fill-checkout'>
                                <div className='main-checkout-content-header'>
                                    <h2>Payment Methods</h2>
                                </div>
                                <div className='main-checkout-content'>
                                    <div className='fill-info-shipment'>
                                        <div className="radio-input-checkout">
                                            <input
                                            type="radio"
                                            id="value-1"
                                            name="value-radio"
                                            value="COD"
                                            checked={payMethod === 'COD'}
                                            onChange={handlePayMethodChange}
                                            />
                                            <label htmlFor="value-1">Payment on delivery (COD)</label>
                                        {/*<input
                                            type="radio"
                                            id="value-2"
                                            name="value-radio"
                                            value="MOMO"
                                            checked={payMethod === 'MOMO'}
                                            onChange={handlePayMethodChange}
                                            />
                                            <label htmlFor="value-2">MoMo wallet</label>
                                            <input
                                            type="radio"
                                            id="value-3"
                                            name="value-radio"
                                            value="VNPAY"
                                            checked={payMethod === 'VNPAY'}
                                            onChange={handlePayMethodChange}
                                            />
                                            <label htmlFor="value-3">VNPAY</label> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='access-pay-button'>
                                <button className="pay-btn" onClick={handlePay}>
                                    Pay
                                    <svg className="pay-svgIcon" viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='bill-content'>
                        <div className='bill-summary'>
                            <div className='bill-product'>
                                {/* map over items and display them */}
                                {billItem.map((item, index) =>(
                                    <Link to={`/cart`} key={index} className="bill-pro-item">
                                        <div className="bill-pro-img">
                                            <img src={src+item.thumbnail} alt="product img"></img>
                                        </div>
                                        <div className="cart-pro-info">
                                            <h3 className="cart-pro-title">{item.title}</h3>
                                            <p className="cart-pro-size">{item.size}</p>
                                        </div>
                                        <div className='cart-pro-info'>
                                            <p className="bill-pro-quant">{item.quantity}</p>
                                        </div>
                                        <div className='cart-pro-price'>
                                            <p className="bill-pro-unit-price">{item.total} VND</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className='pre-total'>
                                <div>
                                    Total of all: 
                                    <span>{total} VND</span>
                                </div>
                                <div>
                                    Transport fee: 
                                    <span>{transportFee} VND</span>
                                </div>
                            </div>
                            <div className='total-bill'>
                                <div>
                                    Total:
                                    <span>{totalBill} VND</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer toasts={toasts} removeToast={removeToast}/>
        </>
     );
}

export default Checkout;