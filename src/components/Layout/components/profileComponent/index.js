import React, { useState } from 'react';
import './profileComponent.css';
import { Link } from 'react-router-dom';

function ProfileComponent() {
  const [activeLink, setActiveLink] = useState('/user-profile');

  const handleChangePage = (to) => {
    setActiveLink(to);
  };

  return (
    <>
      <div className='col-md-3 profile-sidebar'>
        <div className='profile-title-sidebar'>
          <h3>
            <span>YOUR ACCOUNT</span>
          </h3>
        </div>
        <div className='profile-content-sidebar'>
          <ul>
            <Link
              to='/user-profile'
              onClick={() => handleChangePage('/user-profile')}
              className={activeLink === '/user-profile' ? 'current' : ''}
            >
              <li>
                <p>Information</p>
              </li>
            </Link>
            <Link
              to='/user-profile/order'
              onClick={() => handleChangePage('/user-profile/order')}
              className={activeLink === '/user-profile/order' ? 'current' : ''}
            >
              <li>
                <p>Orders</p>
              </li>
            </Link>
            <Link
              to='/user-profile/security'
              onClick={() => handleChangePage('/user-profile/security')}
              className={activeLink === '/user-profile/security' ? 'current' : ''}
            >
              <li>
                <p>Security</p>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </>
  );
}

export default ProfileComponent;
