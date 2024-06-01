/* import lib */
import React, { useState, useEffect } from 'react';
import axios from '../../../API/axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import eventEmitter from '../util/EventEmitter'

/* import css */
import '../Product_Details/Product_details.css'
import '../../SignUp/SignUp.css'
import {FaBug} from 'react-icons/fa';
import { IoSend } from "react-icons/io5";
import { AiOutlineRight, AiOutlineClose, AiFillCheckCircle } from 'react-icons/ai';

/* ============================================== */

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

function Product_Details() {
  const src = 'http://localhost:3001/';
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  };
  // State for quantity
  const [quantity, setQuantity] = useState(1);
  
  // State for product, selectedSize, and productPrice
  const [product, setProduct] = useState({});
  const [defaultSize, setDefaultSize] = useState(product.size); // Giá trị kích thước mặc định
  const [selectedSize, setSelectedSize] = useState(null);
  const [productPrice, setProductPrice] = useState(0);

  //State for feedbacks
  const [feedback, setFeedback] = useState([]);
  const [feedbackLength, setFeedbackLength] = useState(0)
  const [feedbackNote, setFeedbackNote] = useState('')

  // Get productId from URL
  const location = useLocation();
  const productId = location.state ? location.state.product_id : null;

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
    const timerId = setTimeout(() => {
        if (toasts.length > 0) {
            removeToast(toasts[0].id); 
        }
    }, toasts.length > 0 ? toasts[0].duration : 0);

    return () => {
        clearTimeout(timerId);
    };
}, [toasts]);


  // Fetch product data from the API
  useEffect(() => {
    axios.post('/product/id/', { id: productId })
      .then((response) => {
        //console.log('Product Data:', response.data);
        setProduct(response.data[0]);
        setDefaultSize(response.data[0].size); // Cập nhật giá trị kích thước mặc định
        setSelectedSize(response.data[0].size); // Cập nhật kích thước hiện tại
        setProductPrice(response.data[0].total);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });

      axios.post('/feedback/', { product_id: productId })
      .then((response) => {
        setFeedback(response.data);
        setFeedbackLength(response.data.length)
        //console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching feedback:', error);
      });
  }, [productId]);

  // Handle quantity increment and decrement
  const incrementQuantity = () => {
    setQuantity(parseInt(quantity,10) + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(parseInt(quantity,10) - 1);
    }
  };

  // Handle size selection
  const handleSizeClick = (size) => {
    axios.put('/product/size/', {
      id: product.id,
      size: size
    })
      .then((response) => {
        const updatedProduct = response.data[0];
        setSelectedSize(updatedProduct.size);
        setProductPrice(updatedProduct.total);
        //console.log('Size updated successfully:', updatedProduct);
      })
      .catch((error) => {
        console.error('Error updating size:', error);
      });
  };

  //add cart
  const navigate = useNavigate();

  const handleAddToCart = async () => {
  
    try {
      if(product.quantity === 0){
        showToast('error', 'The product is out of stock')
      } else if(product.deleted === 1){
        showToast('error', 'This product has been discontinued')
      }else{
        const response = await axios.get('/login/check-status/', config);
        const { status } = response.data;
    
        if (status) {
          await axios.post('/order-detail/add/', {
            product_id: product.id,
            product_size: product.size,
            price: productPrice,
            quantity: quantity,
          }, config);
    
          showToast('success', 'Add to cart successfully');
    
          const res = await axios.get('/order-detail/id/', config);
          const cartLength = res.data.length;
    
          // Emit an event with the updated cart length
          eventEmitter.emit('updateCartLength', cartLength);
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      showToast('error', 'Error add to cart');
      console.error('Error checking login status:', error);
    }
  };

  //for feedback
  const handleSendFb = async()=>{
    setFeedbackNote('')
    await axios.post('/feedback/send/', {product_id: productId, note: feedbackNote} ,config)
      .catch((error)=>{
        console.log(error.message);
      })
  }

  useEffect(()=>{
    axios.post('/feedback/', { product_id: productId })
    .then((response) => {
      setFeedback(response.data);
      setFeedbackLength(response.data.length)
      //console.log(response.data);
    })
    .catch((error) => {
      console.error('Error fetching feedback:', error);
    });
  }, [handleSendFb])

  return (
    <>
      <div className='main-nav'>
        <div className='nav-item'>
          <a href='/product/all'>Product <AiOutlineRight/></a>
          <div className='nav-pro-name'>{product.title}</div>
        </div>
      </div>
      <div className='container item-container'>
        <div className='_2-col-grid item-page'>
          <div className='img-detail-wrap'>
            <div className='item-img'>
              <img className='background-img set-img' src={src+product.thumbnail} alt={product.title}></img>
            </div>
            <div className='item-nutrition'>
              <div className='nutrition-header'>
                INGREDIENT
              </div>
            </div>
            <p className='menu-item-ingredient'>
              {product.ingredients}
            </p>
          </div>
          <div className='func-wrap'>
            <h1 className='func-item-name'>{product.title}</h1>
            <div className='space-div'></div>
            <h4 className='func-item-price'>{productPrice} VND</h4>
            <div className='detail-content'>
              {product.quantity < 0 ? (
                <div className='status-detail'>
                  Status: Sold Out
                </div>
              ) : (product.deleted === 1) ?(
                <div className='status-detail'>
                  Status: Product discontinued
                </div>
              ): (
                <div className='status-detail'>
                  Status: Available
                </div>
              )}
              <div className={`quantity-detail ${product.quantity < 5 ? '' : 'more-quantity-left'}`}>
                  Quantity in Stock: <span>{product.quantity}</span>
              </div>
              <div className='menu-item-ingredient'>
                {product.description}
              </div>
            </div>
            <div className='space-div'></div>
            <div className='func-choosing _2-col-grid'>
              <div className='choosing-form'>
                <form id='product-form' action='' method='get' className='quant-num-cart'>
                <button 
                  className='quant-minus'
                  onClick={(e) => {
                    e.preventDefault(); // Ngăn chặn sự kiện mặc định của nút
                    decrementQuantity();
                  }}
                >
                  <span>-</span>
                </button>

                <input type='text' value={quantity} name='quantity' className='quantity' readOnly></input>

                <button
                  className='quant-plus'
                  onClick={(e) => {
                    e.preventDefault(); // Ngăn chặn sự kiện mặc định của nút
                    incrementQuantity();
                  }}
                >
                  <span>+</span>
                </button>

                  <div className='choose-size'>
                    <div className='selection-form'>
                      <h4 className='func-choose-title'>Size</h4>
                      <div className='func-item-size'>
                      <div className='size-option'>
                      {['16cm', '18cm', '24cm'].map((size, index) => (
                          <div key={index}>
                            <input
                              className='option'
                              id={`op-${size}`} 
                              type='radio'
                              name={`option${index + 1}`} 
                              value={size}
                              checked={selectedSize === size}
                              onChange={() => handleSizeClick(size)}
                            />
                            <label htmlFor={`op-${size}`}> 
                              {size}
                              {selectedSize === size && (
                                <img
                                  className='img-check'
                                  src='https://theme.hstatic.net/1000348721/1000449307/14/select-pro.png?v=566'
                                  style={{ display: selectedSize === size ? 'block' : 'none' }}
                                  onClick={() => handleSizeClick(size)}
                                />
                              )}
                            </label>
                          </div>
                        ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className='add-cart-func' onClick={handleAddToCart}>
                <button className='add-cart-btn'>
                  <span>ADD TO CART</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='feedback-container'>
          <div className='feedback-header'>
            <h3>Feedbacks</h3>
          </div>
          <div className='feedback-main'>
            <div className='input-feedback-area'>
              <input
                value={feedbackNote}
                placeholder='Give us your feedback...'
                onChange={(e) => setFeedbackNote(e.target.value)}
              />
              <IoSend className='send-feedback-icon' onClick={handleSendFb}/>
            </div>
            <div className='show-all-feedback'>
              <h3>All Feedbacks:</h3>
              {feedbackLength === 0 ? (
                <div className='no-feedback'>
                  <h3>There is no feedback yet</h3>
                </div>
              ) : (
                <ul className='feedback-list'>
                  {feedback.map((item) => (
                    <li className='feedback-item' key={item.id}>
                      <div className='feedback-item-ava'>
                        <img src={src+item.avatar} alt='user_ava'/>
                      </div>
                      <div className='feedback-content'>
                        <h3>{item.fullname}</h3>
                        <span>{item.note}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast}/>
    </>
  );
}

export default Product_Details;
