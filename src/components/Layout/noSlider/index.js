import Header from "../components/Header";
import Footer from "../components/Footer";

function noSlider({children}) {
    return ( 
        <div>
            <Header/>
            <div className="body-container">
                <div className="content">
                    {children}
                </div>
            </div>
            <Footer/>
        </div>
     );
}

export default noSlider;