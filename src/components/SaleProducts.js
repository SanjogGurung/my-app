import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productsSlice";
import ProductCard from "./ProductCard";
import '../styles/SaleProducts.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { selectDiscountedProducts } from '../redux/slices/productsSlice';


export default function SaleProducts() {
    const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3, 
          slidesToSlide: 1,
        },
        tablet: {
          breakpoint: { max: 1024, min: 768 },
          items: 2,
          slidesToSlide: 1,
        },
        mobile: {
          breakpoint: { max: 768, min: 0 },
          items: 1,
          slidesToSlide: 1,
        },
    };
    
    const dispatch = useDispatch();
    const discountedProducts = useSelector(selectDiscountedProducts);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch])

    return (
        <div className="discounted-products">
          <h2 className="discounted-title">ON Sale</h2>
          {discountedProducts.length > 0 ? (
            <Carousel
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              keyBoardControl={true}
              showDots={false}
              arrows={true}
              containerClass="carousel-container"
              itemClass="carousel-item"
            >
              {discountedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  id={product.id}
                  isStaffPanel={false}
                />
              ))}
            </Carousel>
          ) : (
            <p className="no-products">No discounted products available.</p>
          )}
        </div>
      );
    
}