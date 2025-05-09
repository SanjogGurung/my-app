import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productsSlice";
import ProductCard from "../components/ProductCard";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/ProductsPage.css";

const ProductsPage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 134000]);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(134000);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Get products, loading, and error state from Redux store
  const { products, isLoading, error } = useSelector((state) => state.products);

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Calculate min and max price from products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((product) => product.price || 0);
      const min = Math.floor(Math.min(...prices)) || 0;
      const max = Math.ceil(Math.max(...prices)) || 134000;
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
      console.log("Price range calculated:", { minPrice: min, maxPrice: max });
    }
  }, [products]);

  // Extract search query from URL on mount or when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q") || "";
    setSearchQuery(query);
    console.log("Search query from URL:", query);
  }, [location.search]);

  // Handle search, filters, sorting, and reset pagination on filter change
  useEffect(() => {
    let filtered = products || [];

    console.log("Initial products count:", filtered.length);

    // Search by name, description, or brand
    if (searchQuery) {
      filtered = filtered.filter((product) => {
        const nameMatch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const descriptionMatch = product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const brandMatch = product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || descriptionMatch || brandMatch;
      });
      console.log("After search filter:", filtered.length);
    }

    // Filter by price range
    const [min, max] = priceRange;
    filtered = filtered.filter(
      (product) => (product.price || 0) >= min && (product.price || 0) <= max
    );
    console.log("After price range filter:", filtered.length, { min, max });

    // Filter by brand
    if (brand) {
      filtered = filtered.filter((product) =>
        product.brand?.toLowerCase() === brand.toLowerCase()
      );
      console.log("After brand filter:", filtered.length, { brand });
    }

    // Filter by category (map categories to price ranges in NPR)
    if (category) {
      const categoryPriceRanges = {
        budget: [0, 26800],
        "low mid range": [26800, 67000],
        "high mid range": [67000, 134000],
        flagship: [134000, Infinity],
      };
      const [catMin, catMax] = categoryPriceRanges[category.toLowerCase()] || [0, Infinity];
      filtered = filtered.filter(
        (product) => (product.price || 0) >= catMin && (product.price || 0) <= catMax
      );
      console.log("After category filter:", filtered.length, { category, catMin, catMax });
    }

    // Sort the filtered products
    if (sortBy) {
      filtered = [...filtered];
      if (sortBy === "price-asc") {
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        console.log("Sorted by price ascending:", filtered.map(p => p.price));
      } else if (sortBy === "price-desc") {
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        console.log("Sorted by price descending:", filtered.map(p => p.price));
      } else if (sortBy === "release-date-asc") {
        filtered.sort((a, b) => {
          const dateA = new Date(a.releaseDate || a.launchDate);
          const dateB = new Date(b.releaseDate || b.launchDate);
          if (isNaN(dateA) && isNaN(dateB)) return 0;
          if (isNaN(dateA)) return 1;
          if (isNaN(dateB)) return -1;
          return dateA - dateB;
        });
        console.log("Sorted by release date ascending:", filtered.map(p => p.releaseDate || p.launchDate));
      } else if (sortBy === "release-date-desc") {
        filtered.sort((a, b) => {
          const dateA = new Date(a.releaseDate || a.launchDate);
          const dateB = new Date(b.releaseDate || b.launchDate);
          if (isNaN(dateA) && isNaN(dateB)) return 0;
          if (isNaN(dateA)) return 1;
          if (isNaN(dateB)) return -1;
          return dateB - dateA;
        });
        console.log("Sorted by release date descending:", filtered.map(p => p.releaseDate || p.launchDate));
      }
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
    console.log("Final filtered products count:", filtered.length);
  }, [searchQuery, priceRange, brand, category, sortBy, products]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter changes
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(location.search);
    params.delete("q");
    navigate(`${location.pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="products-page">
      {/* Display Search Query */}
      {searchQuery && (
        <div className="search-info">
          <p>
            Showing results for: <strong>{searchQuery}</strong>
          </p>
          <button onClick={clearSearch} className="clear-search-btn">
            Clear Search
          </button>
        </div>
      )}

      {/* Main Content with Sidebar */}
      <div className="main-content-products">
        {/* Filters (Vertical Sidebar) */}
        <div className="filters">
          <h3>Filters</h3>
          <div className="filter-group price-filter-group">
            <label>Price Range:</label>
            <div className="price-range-display">NPR {priceRange[0]} - NPR {priceRange[1]}</div>
            <Slider
              range
              min={minPrice}
              max={maxPrice}
              value={priceRange}
              onChange={handlePriceRangeChange}
              step={1000}
              trackStyle={{ backgroundColor: "#007bff" }}
              handleStyle={{ borderColor: "#007bff", backgroundColor: "#007bff" }}
              railStyle={{ backgroundColor: "#ddd" }}
              className="price-slider"
            />
          </div>
          <div className="filter-group">
            <label>Brand:</label>
            <select value={brand} onChange={handleBrandChange} aria-label="Filter by brand">
              <option value="">All</option>
              <option value="samsung">Samsung</option>
              <option value="apple">Apple</option>
              <option value="google">Google</option>
              <option value="xiaomi">Xiaomi</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Category:</label>
            <select value={category} onChange={handleCategoryChange} aria-label="Filter by category">
              <option value="">All</option>
              <option value="budget">Budget</option>
              <option value="low mid range">Low Mid Range</option>
              <option value="high mid range">High Mid Range</option>
              <option value="flagship">Flagship</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort By:</label>
            <select value={sortBy} onChange={handleSortChange} aria-label="Sort products">
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="release-date-asc">Release Date: Oldest First</option>
              <option value="release-date-desc">Release Date: Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {isLoading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!isLoading && !error && currentProducts.length === 0 && (
            <p>No products found.</p>
          )}
          {!isLoading &&
            !error &&
            currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                id={product.id}
                isStaffPanel={false}
              />
            ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
              aria-label={`Go to page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;