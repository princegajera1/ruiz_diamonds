import { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../apiConfig';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);


export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [visitors, setVisitors] = useState(12450);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      const data = await response.json();
      setVisitors(data.visitors);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const placeOrder = async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(prev => [data, ...prev]);
        return data;
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const trackVisitor = () => {
    // In a real app, this would call an API to increment visitor count
    setVisitors(prev => prev + 1);
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus, visitors, trackVisitor, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
