/* import css */
import '../Contact/Contact.css';
/* import icon */
/* import img */
const about3 = '/assets/images/about3.webp';

function Contact() {
    return (
        <>
        {/* section */}
        <section className="section-area">
            <div className="section-background">
                <img className="img-background" src={about3} alt="section-background"></img>
            </div>
            <div className="section-content">
                <h1 className="section-title">Please contact us</h1>
                <p className="section-context"> Contact us when you need help or give your feedbacks</p>
            </div>
        </section>
        {/* end section */}

        {/* contact information */}
        <div className='contact-container'>
            <div className='contact-container-grid container'>
                <div className='row'>
                    <div className='col-sm-6'>
                        <h1 className='contact-title'>Member Information</h1>
                        {/* member1 */}
                        <div className='info-item'>
                            <h2 className='name'>Vy Lê</h2>
                            <p>Founder</p>
                            <a href='tel:+84966480829' className='phone'>0966480829</a>
                        </div>
                        {/* member2 */}
                        <div className='info-item'>
                            <h2 className='name'>Name of member</h2>
                            <p>Founder</p>
                            <a href='tel:+84966480829' className='phone'>0966480829</a>
                        </div>
                        {/* member3 */}
                        <div className='info-item'>
                            <h2 className='name'>Name of member</h2>
                            <p>Founder</p>
                            <a href='tel:+84966480829' className='phone'>0966480829</a>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <h1 className='contact-title'>Store Information</h1>
                        {/* store1 */}
                        <div className='info-item item-flex'>
                            <h2 className='name-branch'>primary-store</h2>
                            <p>1 Vo Van Ngan street, Linh Chieu ward, Thu Duc district, Ho Chi Minh city</p>
                        </div>
                        {/* store2 */}
                        <div className='info-item item-flex'>
                            <h2 className='name-branch'>store branch 2</h2>
                            <p>1 Vo Van Ngan street, Linh Chieu ward, Thu Duc district, Ho Chi Minh city</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* end contact information */}
        </>
    );
}

export default Contact;