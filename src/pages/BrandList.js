import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Brands.module.css';
import { useSelector } from 'react-redux';

const BrandList = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8082/brand/brands');
        const brandsData = response.data;
        setBrands(brandsData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch brands:', err);
        setError('Unable to load brands. Please try again later.');
        setLoading(false);
      }
    };

    setTimeout(fetchBrands, 500);
  }, []);

  const handleBrandClick = (brandName) => {
    navigate(`/products?q=${encodeURIComponent(brandName)}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;

    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:8082/brand/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBrands(brands.filter((brand) => brand.id !== id));
      console.log('Deleted brand:', id);
    } catch (err) {
      setError('Failed to delete brand: ' + err.message);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/fallback-brand-image.jpg';
  };

  if (loading) {
    return <div className={styles.loading}>Loading brands...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.brandsContainer}>
      <h2 className={styles.title}>Our Brands</h2>
      <div className={styles.brandsGrid}>
        {brands.map((brand) => (
          <div key={brand.id} className={styles.brandCard}>
            <img
              src={`http://localhost:8082/brand/${brand.id}/imageGet`}
              alt={brand.name}
              className={styles.brandImage}
              onError={handleImageError}
              onClick={() => handleBrandClick(brand.name)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandList;