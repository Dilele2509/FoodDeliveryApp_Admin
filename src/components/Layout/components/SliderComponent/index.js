/* import lib */
import Slider from "react-slick";
import React from "react";
/* import css */
import './Slider.css';
/* import img */
const slider1 = '/assets/images/slider1.webp';
const slider2 = '/assets/images/slider2.webp';
const slider3 = '/assets/images/slider3.webp';

function SliderComponent() {
    const arrImg =[slider1, slider2, slider3];
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,        // Enable autoplay
        autoplaySpeed: 2000,   // Set the duration between slide transitions (in milliseconds)
    };

    return (
        <>
        <div className="slider-main">
            <Slider {...settings}>
                {arrImg.map((image) => {
                    return (
                        <div key={image}>
                            <img className="slider-img" src={image} alt="slider_img"/>
                        </div>
                    );
                })}
            </Slider>
        </div>

        </>
    );
}


export default SliderComponent;