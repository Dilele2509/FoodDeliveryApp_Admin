/* import css */
import './Home.css';
/* import icon */
import { GrShare } from 'react-icons/gr';

/* import img */
const about1 = '/assets/images/about1.webp';
const about2 = '/assets/images/about2.webp';
const about3 = '/assets/images/about3.webp';
const bread_category = '/assets/images/bread_category.webp';
const cake_category = '/assets/images/cake_category.webp';
const pastry_category = '/assets/images/pastry_category.jpg';
const about_page1 = '/assets/images/about_page1.jpg';

function Home() {
    return(
        <>
        {/* about */}
        <div className="about-homepage">
            <div className="container-default">
                <div className='container-grid text-container'>
                    <div className='about-container'>
                        <h2 className='title-about'>About Us</h2>
                        <p className='content-about'>Website này được tạo ra để bán bánh nhưng mà hiện tại thì chưa có bánh để bán.
                        Nhưng mà chung quy thì nó vẫn là một cái website dùng để bán bánh <br/>
                        -VyLe-</p>
                        <a className='btn-link' href='/about-us'>
                            <div className='title-wrapper'><p className='btn-read-more'>Read more</p></div>
                        </a>
                    </div>
                </div>
                <div className="img-3-left-grid">
                    <img className='about-img-33' src={about1} alt='about1_img'></img> 
                    <div className='grid-1-col'>
                    <img className='about-img' src={about2} alt='about1_img'></img>
                    <img className='about-img' src={about3} alt='about1_img'></img>
                    </div> 
                </div>
            </div>
        </div>
        {/* end about */}
        {/* preview category */}
        <div className='preview-homepage'>
            <div className='container-default'>
                <h3 className='heading-title'>Products</h3>
                <div className='main-container'>
                    <div className='describe-content'>
                        <p className='content-paragraph'>
                            UrBakery sẽ cung cấp cho bạn những mặt hàng chính như ở dưới này nè, tụi tui bán bánh các loại cụ thể là 3 loại ở duới nhe. 
                        </p>
                    </div>
                </div>
                <div className='main-container'>
                    <div className='_3-col-grid'>
                        {/* cat1 */}
                        <a className='home-cat-link transform-shift' href='/product/2'>
                            <div className='menu-cat-wrap'>
                                <div className='cat-img-container'>
                                    <img className='cat-img' src={bread_category}></img>
                                </div>
                                <div className='cat-name'>
                                    <p className='cat-name-item'>Bread</p>
                                </div>
                            </div>
                        </a>
                        {/* cat2 */}
                        <a className='home-cat-link transform-shift' href='/product/1'>
                            <div className='menu-cat-wrap'>
                                <div className='cat-img-container'>
                                    <img className='cat-img' src={cake_category}></img>
                                </div>
                                <div className='cat-name'>
                                    <p className='cat-name-item'>Cake</p>
                                </div>
                            </div>
                        </a>
                        {/* cat3 */}
                        <a className='home-cat-link transform-shift' href='/product/3'>
                            <div className='menu-cat-wrap'>
                                <div className='cat-img-container'>
                                    <img className='cat-img' src={pastry_category}></img>
                                </div>
                                <div className='cat-name'>
                                    <p className='cat-name-item'>Pastry</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        {/* end preview category */}
        {/* news */}
            <div className='news-homepage'>
                <div className='container-default'>
                    <h3 className='heading-title'>Bakery News</h3>
                    <div className='main-container'>
                        <div className='describe-content'>
                            <p className='content-paragraph'>
                                Đọc tin tức của cửa hàng ở đây nè
                            </p>
                        </div>
                    </div>
                    <div className='main-container'>
                        <div className='_3-col-grid'>
                            {/* news1 */}
                            <a className='news-wrap transform-shift' href='/about-us'>
                                <div className='img-wrap'>
                                    <img className='cat-img' src={about_page1}></img>
                                </div>
                                <div className='title-name-type'>
                                    <div className='title-wrap'>
                                        <div className='title-arrow'>NEWS</div>
                                        <div className='title-icon'><GrShare/></div>
                                    </div>
                                    <div className='news-title'>This is the best news title kakaka</div>
                                </div>
                            </a>
                            {/* news2 */}
                            <a className='news-wrap transform-shift' href='/about-us'>
                                <div className='img-wrap'>
                                    <img className='cat-img' src={about_page1}></img>
                                </div>
                                <div className='title-name-type'>
                                    <div className='title-wrap'>
                                        <div className='title-arrow'>NEWS</div>
                                        <div className='title-icon'><GrShare/></div>
                                    </div>
                                    <div className='news-title'>This is the best news title kakaka</div>
                                </div>
                            </a>
                            {/* news3 */}
                            <a className='news-wrap transform-shift' href='/about-us'>
                                <div className='img-wrap'>
                                    <img className='cat-img' src={about_page1}></img>
                                </div>
                                <div className='title-name-type'>
                                    <div className='title-wrap'>
                                        <div className='title-arrow'>NEWS</div>
                                        <div className='title-icon'><GrShare/></div>
                                    </div>
                                    <div className='news-title'>This is the best news title kakaka</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        {/* end news */}
        </>
    );
}

export default Home;