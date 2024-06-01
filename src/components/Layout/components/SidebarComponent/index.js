/* import css */
import './Sidebar.css';
/* import icon */
import { GiCakeSlice, GiBreadSlice, GiCupcake } from 'react-icons/gi';

function SliderComponent() {
    return ( 
        <>
        <div className='product-container'>
            {/* section */}
            <section className="section-area">
                <div className="section-background section-product-bg">
                    <img className="img-background img-product-bg" src='/assets/images/about_page2.jpg' alt="section-background"></img>
                </div>
                <div className="section-content">
                    <h1 className="section-title">Product</h1>
                </div>
            </section>
            {/* end section */}
            {/* sidebar header */}
            <header className="sidebar-header">
                <div className="nav-sidebar">
                    <ul className="nav-list">
                        <a href='/product/2'>
                            <li className="list-item transform-sizeUp">
                                <p>Bread</p>
                                <div className='icon-item'><GiBreadSlice/></div>
                            </li>
                        </a>
                        <a href='/product/1'>
                            <li className="list-item transform-sizeUp">
                                <p>Cake</p>
                                <div className='icon-item'><GiCakeSlice/></div>
                            </li>
                        </a>
                        <a href='/product/3'>
                            <li className="list-item transform-sizeUp">
                                <p>Pastry</p>
                                <div className='icon-item'><GiCupcake/></div>
                            </li>
                        </a>
                    </ul>
                </div>
            </header>
            {/* end sidebar header */}
        </div>
        </>
    );
}

export default SliderComponent;