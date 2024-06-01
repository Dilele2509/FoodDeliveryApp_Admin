import Header from "../components/Header";
import ProfileComponent from '../components/profileComponent';
import Footer from "../components/Footer";

import './profileSidebar.css'

function ProfileSidebar({children}) {
    return ( 
        <>
            <Header/>
            <div className='body-container'>
                <div className="profile-container">
                    <ProfileComponent/>
                    <div className='content-profile-wrap'>
                        <div className='content-profile'>
                            <div className='profile-title'>
                                <h2>User Information</h2>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ProfileSidebar;