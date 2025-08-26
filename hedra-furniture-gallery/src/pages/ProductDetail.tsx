import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { apiGetRequest } from '../../service';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>(); // Get the product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Retrieve the token from localStorage (or context, depending on your setup)
  const token = localStorage.getItem('authToken'); // Replace with your token retrieval method

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await apiGetRequest(`products/getProductById/${id}`, token); // Pass the token

        // Check if response contains the product data
        const productData = response.data;
        console.log(response)

        // Safely handle missing or malformed specifications
        if (response) {
          // Parse specifications if it's a string
          if (typeof response.specifications === "string") {
            try {
              response.specifications = JSON.parse(response.specifications); // Parse it
            } catch (error) {
              console.error("Error parsing specifications:", error);
              response.specifications = []; // Fallback to empty array if parsing fails
            }
          }

          // If specifications field is missing, provide a fallback (e.g., empty array)
          if (!response.specifications) {
            response.specifications = [];
          }

          setProduct(response); // Update state with the fetched product data
        }
      } catch (error) {
        console.error("Failed to fetch product details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, token]); // Fetch whenever id or token changes

  if (!id) {
    return <Navigate to="/catalog" replace />; // Redirect if no id is found
  }

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
          {/* <Link to="/catalog">
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Button>
          </Link> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* Render other product details */}
      {product.specifications.length > 0 && (
        <div>
          <h2>Specifications:</h2>
          <ul>
            {product.specifications.map((spec, index) => (
              <li key={index}>
                <strong>{spec.key}:</strong> {spec.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
