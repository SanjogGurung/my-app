import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, clearError, clearProduct} from "../redux/slices/productsSlice";
import styles from '../styles/ProductDescriptionPage.module.css';

export default function ProductDescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = useSelector((state) => state.products.product);
  const loading = useSelector((state) => state.products.isLoading);
  const error = useSelector((state) => state.products.error);


  // const [product, setProduct] = useState({
  //   name: "",
  //   price: "",
  //   isOnSale: false,
  //   discountPercentage: 0,
  //   isAvailable: false,
  //   quantity: 0,
  //   releaseDate: "",
  //   brand: "",
  //   category: "",
  //   description: "",
  //   imageName1: `http://localhost:8082/product/${id}/image/1`,
  //   imageName2: `http://localhost:8082/product/${id}/image/2`,
  //   imageName3: `http://localhost:8082/product/${id}/image/3`,
  //   imageName4: `http://localhost:8082/product/${id}/image/4`,
  //   spec: {
  //     display: "",
  //     processor: "",
  //     ram: "",
  //     os: "",
  //     rearCamera: "",
  //     frontCamera: "",
  //     security: "",
  //     battery: "",
  //   },
  // });

  const [mainImage, setMainImage] = useState(`http://localhost:8082/product/${id}/image/1`);
  const [secondImage, setSecondImage] = useState(`http://localhost:8082/product/${id}/image/2`);
  const [thirdImage, setThirdImage] = useState(`http://localhost:8082/product/${id}/image/3`);
  const [fourthImage, setFourthImage] = useState(`http://localhost:8082/product/${id}/image/4`);
  const [quantityToBuy, setQuantityToBuy] = useState(1);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:8082/product/${id}`);
  //       const fetchedProduct = {
  //         name: response.data.name || "",
  //         price: response.data.price || "",
  //         isOnSale: response.data.isOnSale || false,
  //         discountPercentage: response.data.discountPercentage || 0,
  //         isAvailable: response.data.isAvailable || false,
  //         quantity: response.data.quantity || 0,
  //         releaseDate: response.data.releaseDate || "",
  //         brand: response.data.brand || "",
  //         category: response.data.category || "",
  //         description: response.data.description || "",
  //         imageName1: `http://localhost:8082/product/${id}/image/1`,
  //         imageName2: `http://localhost:8082/product/${id}/image/2`,
  //         imageName3: `http://localhost:8082/product/${id}/image/3`,
  //         imageName4: `http://localhost:8082/product/${id}/image/4`,
  //         spec: {
  //           display: response.data.spec?.display || "",
  //           processor: response.data.spec?.processor || "",
  //           ram: response.data.spec?.ram || "",
  //           os: response.data.spec?.os || "",
  //           rearCamera: response.data.spec?.rearCamera || "",
  //           frontCamera: response.data.spec?.frontCamera || "",
  //           security: response.data.spec?.security || "",
  //           battery: response.data.spec?.battery || "",
  //         },
  //       };
  //       setProduct(fetchedProduct);
  //       setMainImage(fetchedProduct.imageName1);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error("Fetch Error:", err);
  //       setError("Failed to load product.");
  //       setLoading(false);
  //     }
  //   };
  //   fetchProduct();
  // }, [id]);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
        dispatch(clearProduct());
    };
  }, [dispatch, id]);

  const handleBack = () => {
    navigate("/staff/products");
  };

  const handleAddToCart = () => {
    alert(`${quantityToBuy} ${product.name}(s) added to cart!`);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1));
    setQuantityToBuy(value);
  };

  const calculateDiscountedPrice = () => {
    const originalPrice = parseFloat(product.price);
    const discount = product.discountPercentage / 100;
    return (originalPrice * (1 - discount)).toFixed(2);
  };

  const handleThumbnailClick = (imageSrc) => {
    switch (imageSrc) {
      case secondImage:
        setSecondImage(mainImage);
        setMainImage(imageSrc);
        break;
      case thirdImage:
        setThirdImage(mainImage);
        setMainImage(thirdImage);
        break;
      case fourthImage:
        setFourthImage(mainImage);
        setMainImage(fourthImage);
    }
    setMainImage(imageSrc);
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading product...</div>;
  if (error) return (
    <div className="text-center text-xl mt-10 text-red-500">
      {error} <Link to="/staff/products" className="text-blue-500 underline">Go back</Link>
    </div>
  );

  if (!product) return null; // Or return a "Product not found" message


  return (
    <div className={styles['product-description-page']}>
        <div className={styles['product-container']}>
            <div className={styles['top-section']}>
                <div className={styles['image-column']}>
                    <img src={mainImage} alt="Main Image" className={styles['main-image']} />
                    <div className={styles['thumbnail-row']}>
                        {secondImage && (
                            <img
                                src={secondImage}
                                alt="Image 2"
                                className={styles['thumbnail-image']}
                                onClick={() => handleThumbnailClick(secondImage)}
                            />
                        )}
                        {thirdImage && (
                            <img
                                src={thirdImage}
                                alt="Image 3"
                                className={styles['thumbnail-image']}
                                onClick={() => handleThumbnailClick(thirdImage)}
                            />
                        )}
                        {fourthImage && (
                            <img
                                src={fourthImage}
                                alt="Image 4"
                                className={styles['thumbnail-image']}
                                onClick={() => handleThumbnailClick(fourthImage)}
                            />
                        )}
                    </div>
                </div>

                <div className={styles['info-column']}>
                    <h2 className={styles['product-title']}>{product.name}</h2>
                    <div className={styles['price-section']}>
                        {product.isOnSale ? (
                            <>
                                <span className={styles['original-price']}>${parseFloat(product.price).toFixed(2)}</span>
                                <span className={styles['discounted-price']}>${calculateDiscountedPrice()}</span>
                            </>
                        ) : (
                            <span className={styles['price']}>${parseFloat(product.price).toFixed(2)}</span>
                        )}
                    </div>
                    <p className={styles['description-text']}>{product.description || "No description available."}</p>
                    <div className={styles['quantity-section']}>
                        <p className={styles['availability']}>{product.isAvailable ? "In Stock" : "Out of Stock"}</p>
                        <div className={styles['quantity-buy']}>
                            <label htmlFor="quantity" className={styles['quantity-label']}>Quantity:</label>
                            <input
                                type="number"
                                id="quantity"
                                value={quantityToBuy}
                                onChange={handleQuantityChange}
                                min="1"
                                max={product.quantity}
                                disabled={!product.isAvailable || product.quantity === 0}
                                className={styles['quantity-input']}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className={styles['add-to-cart-button']}
                        disabled={!product.isAvailable || product.quantity === 0}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className={styles['specifications-section']}>
                <h3 className={styles['section-title']}>Specifications</h3>
                <div className={styles['specifications-table']}>
                    <div className={styles['table-row']}>
                        <span className={styles['table-label']}>Display</span>
                        <span className={styles['table-value']}>{product.spec?.display || "N/A"}</span>
                    </div>
                    <div className={styles['table-row']}>
                        <span className={styles['table-label']}>Processor</span>
                        <span className={styles['table-value']}>{product.spec?.processor || "N/A"}</span>
                    </div>
                    <div className={styles['table-row']}>
                        <span className={styles['table-label']}>RAM</span>
                        <span className={styles['table-value']}>{product.spec?.ram || "N/A"}</span>
                    </div>
                    <div className={styles['table-row']}>
                        <span className={styles['table-label']}>OS</span>
                        <span className={styles['table-value']}>{product.spec?.os || "N/A"}</span>
                    </div>
                    <div className={styles['table-row']}>
                        <span className={styles['table-label']}>Rear Camera</span>
                        <span className={styles['table-value']}>{product.spec?.rearCamera || "N/A"}</span>
                    </div>
                    <div className={styles['table-row']}>
                        <span className={styles['table-label']}>Front Camera</span>
                        <span className={styles['table-value']}>{product.spec?.frontCamera || "N/A"}</span>
                    </div>
                    <div className={styles['table-row']}>
                        <span className={styles['table-label']}>Security</span>
                        <span className={styles['table-value']}>{product.spec?.security || "N/A"}</span>
                    </div>
                    <div className={styles['table-row']}>
                        <span className={styles['table-label']}>Battery</span>
                        <span className={styles['table-value']}>{product.spec?.battery || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className={styles['actions']}>
                <button onClick={handleBack} className={styles['back-button']}>
                    Back to Products
                </button>
            </div>
        </div>
    </div>
);
}