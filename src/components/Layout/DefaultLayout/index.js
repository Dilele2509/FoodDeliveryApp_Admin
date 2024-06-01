import Header from "../components/Header";
import SliderComponent from '../components/SliderComponent';
import Footer from "../components/Footer";

function DefaultLayout({children}) {
    return ( 
        <div style={{ display: "block" }}>
            <Header/>
            <SliderComponent/>
            <div className="body-container">
                <div className="content">
                    {children}
                </div>
            </div>
            <Footer/>
        </div>
     );
}

export default DefaultLayout;