/* import css */
import '../About/About.css';

/* import img */
const about_page3 = "/assets/images/about_page3.jpg"

function About() {
    return(
        <>
        {/* about */}
        <div className="about-homepage">
            <div className="container-default">
                <div className="container-about-page">
                    <div className="img-about-page">
                        <img className='img-items' src={about_page3} alt='about_us_img'></img>
                    </div>
                    <div className='content-container'>
                        <h2 className='title-about'>About Us</h2>
                        <p className='content-about'>CHƯA BIẾT VIẾT GÌ TRONG NÀY <br/>
                        -VyLe-</p>
                    </div>
                </div>
            </div>
        </div>
        {/* end about */}
        </>
    );
}

export default About;