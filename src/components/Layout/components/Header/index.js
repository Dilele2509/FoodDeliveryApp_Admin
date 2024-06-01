/* import css */
import './Header.css'

/* import icons */
import {GiCakeSlice} from 'react-icons/gi';
import {BiSearchAlt} from 'react-icons/bi';
import {MdOutlineAccountCircle} from 'react-icons/md';
import {MdShoppingCart} from 'react-icons/md';
import {MdOutlineExpandMore} from 'react-icons/md';

import React, { useState, useEffect } from 'react';
import axios from '../../../../API/axios';
import eventEmitter from '../../../../pages/Users/util/EventEmitter';
import { Link } from 'react-router-dom';

function Header() {
  const src = 'http://localhost:3001/';
  const [userAvatar, setUserAvatar] = useState(null);
  const [cartLength, setCartLength] = useState(0);
  const [searchResult, setSearchResult] = useState([]);
  const [hasResult, setHasResult] = useState(false);
  const [searchData, setSearchData] = useState({
    title: ''
  })
  const config = {
    headers: {
      "Content-Type": "application/json"
      },
      withCredentials: true
  }

  // Function to set the user avatar
  const setUserAvatarUrl = (avatarUrl) => {
    setUserAvatar(avatarUrl);
  };

  useEffect(() => {
    const updateCartLength = (length) => {
      setCartLength(length);
    };

    // Listen for the 'updateCartLength' event
    eventEmitter.on('updateCartLength', updateCartLength);

    // Cleanup the event listener when the component unmounts
    return () => {
      eventEmitter.off('updateCartLength', updateCartLength);
    };
  }, []); 

  useEffect(() => {
    // check user login status when the component mounts
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('/login/check-status/', config);
        const { status } = response.data;
  
        if (status) {
          const avatarUrl = await axios.get('user/id/', config);
  
          axios.get('/order-detail/id/', config)
            .then((response) => {
              setCartLength(response.data.length);
              
              const cartCountElement = document.querySelector('.cart-has-items');
              if (cartCountElement) {
                cartCountElement.innerText = response.data.length;
              }
            })
            .catch((error) => {
              console.error('Error fetching cart items:', error);
            });
  
          setUserAvatarUrl(src +avatarUrl.data.user[0].avatar);
        } else {
          console.log('no logged in yet');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
  
    checkLoginStatus();
  }, [config]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  
  useEffect(() => {
    //console.log("searchData has been updated:", searchData.title);
    if(searchData.title !== '')
    {
      setHasResult(true)
      axios.post('/product/search/', {title: searchData.title},config)
      .then((response)=>{
        //console.log(response.data);
        setSearchResult(response.data)
      })
    } else{
      setSearchResult([])
      setHasResult(false)
    }
  }, [searchData]); 
  
  return (
      <header>
      <div className="menu_sidebar">
        <div className="logo">
          <a href="/">
          <GiCakeSlice className="iconLogo"/> UrCake
          </a>
        </div>
        <nav className="navigation navbar navbar-dark">
          <div className="" id="">
            <ul className="navbar-nav">
              <li className="nav-item transform-shift">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item transform-shift">
                <a className="nav-link" href="/about-us">
                  About Us
                </a>
              </li>
              <li className="nav-item transform-shift nav-subnav">
                <a className="nav-link" href="/product/all">
                  Product<MdOutlineExpandMore/>
                </a>
                <div className='subnav-product'>
                  <ul className='category-ls'>
                      <li className='subnav-item'>
                          <a className='subnav-link' href='/product/2'>
                              Bread
                          </a>
                      </li>
                      <li className='subnav-item'>
                          <a className='subnav-link' href='/product/1'>
                              Cake
                          </a>
                      </li>
                      <li className='subnav-item'>
                          <a className='subnav-link' href='/product/3'>
                              Pastry
                          </a>
                      </li>
                  </ul>
                </div>
              </li>
              <li className="nav-item transform-shift">
                <a className="nav-link" href="/contact-us">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="sub-nav-header">
            <div className="pre-search-header">
                <BiSearchAlt className="iconHeader pre-search-btn" />
                <input 
                  spellCheck={false}
                  id='title' 
                  className="pre-searchInput" 
                  placeholder="Search" 
                  type="text" value={searchData.title} 
                  onChange={handleInputChange}/>
                  {/* {console.log(searchData.title)} */}
                  <div className={`${!hasResult ? 'disNone' : ''} pre-search-result`}>
                    <ul className='search-result-list'>
                      <h4>Search Result</h4>
                      {searchResult.map((item, index) => (
                        <Link to={`/product/detail/`} state={{product_id: item.id}} key={item.id || index} className='link-search-result'>
                          <li className='search-result-item'>
                            <div className='result-img-area'>
                              <img src={src+item.thumbnail} alt='product-img'/>
                            </div>
                            <div className='search-result-title'>
                              <h3>{item.title}</h3>
                            </div>
                          </li>
                        </Link>
                      ))}
                    </ul>
                  </div>
            </div>
            <a className={`icon-link icon-cart`} href="/cart">
              <MdShoppingCart className="iconHeader" />
              <span className={`disNone ${cartLength > 0 ? 'cart-has-items' : ''}`} >{cartLength}</span>
            </a>
            {userAvatar ? (
              <a className='icon-link' href='/user-profile'>
                <img id="userAvatar" className="iconHeader userAva" src={userAvatar} alt="User Avatar" />
              </a>
            ) : (
              <a className="icon-link" href="/login"><MdOutlineAccountCircle className="iconHeader" /></a>
            )}
        </div>
      </div>
      </header>
  );
}

export default Header;