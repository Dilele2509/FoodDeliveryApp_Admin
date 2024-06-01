/* import css */
import { useEffect, useState } from 'react';
import './Footer.css';
import axios from '../../../../API/axios';

/* import icons */
import {BsFacebook, BsInstagram} from 'react-icons/bs';
function Footer() {
   const config = {
      headers: {
        "Content-Type": "application/json"
        },
    }
   const [receiverData, setReceiverData] = useState({
      name: '',
      email: ''
   })

   const handleInputChange = (e) => {
      const { id, value } = e.target;
      setReceiverData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    };

   const handleSubmit = async (e) => {
   e.preventDefault();

   if (receiverData.email === '' || receiverData.name === '') {
      alert('Can not submit, please fill in all your information');
   } else {
      try {
         setReceiverData({
            name: '',
            email: ''
         })
         await axios.post('/get-newsletter', {
            to: receiverData.email,
            name: receiverData.name,
         }, config)
         .then((response)=>{
            alert('Thanks for joining us');
            console.log(response.data);
         })

      } catch (error) {
         console.error('Error submitting newsletter:', error);
         alert('An error occurred while submitting the newsletter');
      }
   }
   };

    return(
        <>
        <footer>
         <div className="footer">
            <div className="container footer-container">
               <div className="row">
                  <div className="col-md-3">
                     <div className="infoma text_align_left">
                        <h3>About</h3>
                        <p className="ipsum">Thanks for visited our website, please get more information in other social medias </p>
                        <ul className="social_icon">
                           <li><a href="https://www.facebook.com/vyle2509/"><BsFacebook/></a></li>
                           <li><a href="https://www.instagram.com/imvylee_/"><BsInstagram/></a></li>
                        </ul>
                     </div>
                  </div>
                  <div className="col-md-3">
                     <div className="infoma">
                        <h3>Address</h3>
                        <ul className="conta">
                           <li>1 Vo Van Ngan street, Linh Chieu ward, Thu Duc district, Ho Chi Minh city <br/>
                           </li>
                           <li>(+84) 966480829 <br/>(+84) 848047469</li>
                           <li> <a href=""> levy3443@gmail.com</a></li>
                        </ul>
                     </div>
                  </div>
                  <div className="col-md-3 pad_lrft">
                     <div className="infoma">
                        <h3>Links</h3>
                        <ul className="fullink">
                           <li><a href="/">Home</a></li>
                           <li><a href="/about-us">About</a></li>
                           <li><a href="/product">Product</a></li>
                            <li><a href="/contact-us">Contact</a></li>
                        </ul>
                     </div>
                  </div>
                  <div className="col-md-3">
                     <div className="infoma">
                        <h3>Newsletter</h3>
                        <div className="form_subscri">
                           <form onSubmit={handleSubmit}>
                              <div className="row">
                                 <div className="col-md-12">
                                    <input id='name' className="newsl" placeholder="Your Name" value={receiverData.name} type="text" onChange={handleInputChange} />
                                 </div>
                                 <div className="col-md-12">
                                    <input id='email' className="newsl" placeholder="Email" value={receiverData.email} type="text" onChange={handleInputChange}/>
                                 </div>
                                 <div className="col-md-12">
                                    <button type="submit" className="subsci_btn">Subscribe</button>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="copyright">
               <div className="row">
                  <div className="col-md-12">
                     <p>© 2023 All Rights Reserved.  <a href="https://www.facebook.com/vyle2509/"> Vy Le's Template</a></p>
                  </div>
               </div>
            </div>
         </div>
      </footer>
        </>
    );
}

export default Footer;