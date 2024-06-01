import './AdminSidebar.css'
import '../Header/Header.css';

import { IoMdClose } from "react-icons/io";
import { HiMenu } from "react-icons/hi";

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../../API/axios'

function AdminSidebar() {
    const [activeLink, setActiveLink] = useState('/');
    const [sidebarOpen, setSidebarOpen] = useState(false); // Thêm state để theo dõi trạng thái sidebar
    const [showButton, setShowButton] = useState(true);
    const config = {
        headers: {
            "Content-Type": "application/json"
        },
        withCredentials: true
    }

    const handleChangePage = (to) => {
        setActiveLink(to);
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get('/logout', config);
            console.log(response);
            window.location.href = '/';
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleOpenSidebar = () => {
        setSidebarOpen(true);
        setShowButton(true);
        const asideContainer = document.querySelector('.aside-container');
        if (asideContainer) {
            asideContainer.classList.remove('close-admin-sidebar');
        }
    }

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
        setShowButton(false);
        const asideContainer = document.querySelector('.aside-container');
        if (asideContainer) {
            asideContainer.classList.add('close-admin-sidebar');
        }
    }

    return (
        <>
            {(!sidebarOpen) && ( 
                <button className={`show-sidebar-button ${showButton ? '' : 'close'}`} onClick={handleOpenSidebar}>
                        <HiMenu className="open-sidebar-btn" />
                </button>
            )}
            <aside className={`aside-container`}>
                <IoMdClose className='admin-sidebar-close' onClick={handleCloseSidebar}/>
                <div className='admin-sidebar-header'>
                    <div className="sidebar-logo">
                        <a href="/">
                            <div className="iconLogo">UrCake</div>
                        </a>
                    </div>
                </div>
                <div className='admin-sidebar-content'>
                    <ul className='sidebar-list'>
                        <Link to='/'
                            onClick={() => handleChangePage('/')}
                            className={activeLink === '/' ? 'sidebar-checked' : ''}
                        >
                            <li className='sidebar-list-item'>Dashboard</li>
                        </Link>
                        <Link to='/user'
                            onClick={() => handleChangePage('/user')}
                            className={activeLink === '/user' ? 'sidebar-checked' : ''}
                        >
                            <li className='sidebar-list-item'>Users</li>
                        </Link>
                        <Link to='/category'
                            onClick={() => handleChangePage('/category')}
                            className={activeLink === '/category' ? 'sidebar-checked' : ''}
                        >
                            <li className='sidebar-list-item'>Category</li>
                        </Link>
                        <Link to='/product'
                            onClick={() => handleChangePage('/product')}
                            className={activeLink === '/product' ? 'sidebar-checked' : ''}
                        >
                            <li className='sidebar-list-item'>Products</li>
                        </Link>
                        <Link to='/order'
                            onClick={() => handleChangePage('/order')}
                            className={activeLink === '/order' ? 'sidebar-checked' : ''}
                        >
                            <li className='sidebar-list-item'>Orders</li>
                        </Link>
                        <Link to='/feedback'
                            onClick={() => handleChangePage('/feedback')}
                            className={activeLink === '/feedback' ? 'sidebar-checked' : ''}
                        >
                            <li className='sidebar-list-item'>Feedbacks</li>
                        </Link>
                    </ul>
                </div>
                <div className='admin-sidebar-footer'>
                    <div className='admin-logout'>
                        <button className='admin-logout-btn' onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            </aside>
        </>
     );
}

export default AdminSidebar;