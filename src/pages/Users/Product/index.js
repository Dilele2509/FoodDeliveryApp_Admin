/* import css */
import "./Product.css";

/* import some method */
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from '../../../API/axios'; // Import your Axios instance
import { Link } from "react-router-dom";


function Product() {
  const src = 'http://localhost:3001/';
  const [products, getProducts] = useState([]);
   // Get catId from URL
  const { cat } = useParams();

  useEffect(() => {
    let axiosMethod = axios.post('/product/cat/', {category_id: cat});
    if(cat === '1' || cat === '2' || cat === '3') {
      axiosMethod= axiosMethod;
    }else if(cat === 'all'){
      axiosMethod = axios.get('/products');
    }
    axiosMethod
        .then((response) => {
          if (Array.isArray(response.data)) {
            getProducts(response.data);
          } else {
            console.error('API response does not contain an array:', response.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching product data:', error);
        });
  }, []);
    return (  
        <>
        {/* product menu */}
        <div className='product-menu-container'>
                <div className='main-contain-menu'>
                    <div className='max-width-1280px'>
                        <div className='menu-products'>
                            <div role='list' className='_3-col-grid _3-col-grid_menu'>
                                {/* map over products and display them */}
                                {products.map((product) => (
                                  <div key={product.id} role="listItem" className="menu-item transform-shift">
                                    <Link to={`/product/detail/`} state={{product_id: product.id}} className="item-product">
                                          <div className='img-wrap'>
                                            <img className='img-item' src={src +product.thumbnail} alt={product.title} />
                                            <div className={`img-unavailable-item ${(product.quantity === 0 || product.deleted === 1) ? '' : 'disNone'}`}>Unavailable</div>
                                          </div>
                                          <div className='title-name-type'>
                                              <h3 className='name-title'>{product.title}</h3>
                                          </div>
                                      </Link>
                                  </div>
                                ))}
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* end product menu */}
        </>
    );
}

export default Product;