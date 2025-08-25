import React, { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/ProductContext';  // Import the context
import { Link } from 'react-router-dom'; // For linking to individual product details page

const ProductsList = () => {
  const { products, loading, error } = useProducts(); // Access products, loading, and error from context
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [products, searchQuery]);

  // Debugging the products data
  console.log('Fetched Products:', products);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Product List</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <li key={product.id} className="bg-white p-4 border rounded-md shadow-md">
              <img
                src={product.images[0]} // Dynamically displaying the product image
                alt={product.name}
                className="w-full h-40 object-cover mb-4 rounded-md"
              />
              <h2 className="text-xl font-semibold text-foreground">{product.name}</h2>
              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
              <p className="text-lg font-bold text-primary">${product.price}</p>

              {/* Link to product detail page */}
              <Link to={`/product/${product.id}`} className="text-blue-500 mt-2 inline-block">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsList;
