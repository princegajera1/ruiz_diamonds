import { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../apiConfig';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);


export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        await fetchProducts(); // Wait for the new DB state to arrive
        return { success: true };
      } else {
        const errorData = await response.json();
        console.error('Failed to add product:', errorData);
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, error: error.message };
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
        return { success: true };
      }
    } catch (error) {
      console.error('Error removing product:', error);
      return { success: false };
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        await fetchProducts(); // Wait for the new DB state to arrive
        return { success: true };
      } else {
        const errorData = await response.json();
        console.error('Failed to update:', errorData);
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  };

  const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id) || p.id === id);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, updateProduct, getProductById, loading, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
