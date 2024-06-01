import './AdminFooter.css'

import { Link } from 'react-router-dom';

function AdminFooter() {
    return ( 
        <>
        <div className='div-footer'>
            <div className="copyright">
               <div className="row">
                  <div className="col-md-12">
                     <p>© 2023 All Rights Reserved.  <Link to="https://www.facebook.com/vyle2509/" className='linkTemp'> Vy Le's Template</Link></p>
                  </div>
               </div>
            </div>
        </div>
        </>
     );
}

export default AdminFooter;