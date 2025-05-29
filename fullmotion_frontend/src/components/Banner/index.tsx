import styles from './Banner.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const banners = [
    { id: 1, image: 'src/components/Banner/imagem1.png', alt: 'Banner 1' },
    { id: 2, image: 'src/components/Banner/imagem2.png', alt: 'Banner 2' },
    { id: 3, image: 'src/components/Banner/imagem3.png', alt: 'Banner 3' },
]

function Banner() {  

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false,
    };
  
    return (
      <div className="slider-container">
        <Slider {...settings}>
          {banners.map((banner) => (
            <div key={banner.id} className= {styles.slide}>
              <img src={banner.image} alt={banner.alt} className= {styles.bannerImage} />
            </div>
          ))}
        </Slider>
      </div>
      
    );
  }
  
  export default Banner;