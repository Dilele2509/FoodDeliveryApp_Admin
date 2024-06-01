import '../../Checkout/checkout.css'
import './userOrder.css'
import '../userOrder/OrderDetail/OrderDetail.css'

import axios from '../../../../API/axios'
import {Link} from 'react-router-dom'
import { useState ,useEffect } from 'react'

function UserOrder() {
    const config = {
        headers: {
            "Content-Type": "application/json"
            },
            withCredentials: true  
    }

    const [orderItem, setOrderItem] = useState([])
    useEffect(() =>{
        //goi api fetch order len UI
        axios.get('/order/id/', config)
            .then((response) => {
                setOrderItem(response.data);
                //console.log(response.data);
            })
            .catch((error) =>{
                console.error('Error fetch order data', error.message);
            })
    })

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
    return ( 
        <>
            <div className="user-order-container">
                <div className='user-order-header'>
                    <h2>Purchased Order</h2>
                </div>
                <div className='user-order-list'>
                    <div className='order-table-container'>
                        <table className="table table-order scrollable-table">
                            <thead>
                                <tr>
                                    <th className="order-list-id">ID</th>
                                    <th className="order-list-date">Order Date</th>
                                    <th className="order-list-note">Note</th>
                                    <th className="order-list-status">Status</th>
                                    <th className="order-list-total">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* map over order list then fetch them */}
                                {orderItem.map((item) =>(
                                    item.note !== null ? item.note : item.note = 'no note',
                                    <tr key={item.id} className="cart-item">
                                        <td className="order-list-id">
                                            <Link to='/user-profile/order/detail' state={{order_id: item.id}}>
                                                <div className="user-order-info">
                                                    <h3 className="user-order-title">{item.id}</h3>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="order-list-date">
                                            <div className='user-order-info'>
                                                <p className="user-order-date">{item.order_date}</p>
                                            </div>
                                        </td>
                                        <td className="order-list-note">
                                            <div className='user-order-info'>
                                                <p className="user-order-note">{item.note}</p>
                                            </div>
                                        </td>
                                        <td className="order-list-status">
                                            <div className='user-order-info od-info-status'>
                                                <p className={`user-order-status ${item.status === 0 ? 'cancel' : ''}  ${(item.status !== 4 && item.status !== 0) ? 'notCompleted' : ''}`}>{setStatusDisplay(item.status)}</p>
                                            </div>
                                        </td>
                                        <td className="order-list-total">
                                            <div className='user-order-price'>
                                                <p className="user-order-total">{item.total} VND</p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
            </div>
        </>
     );
}

export default UserOrder;