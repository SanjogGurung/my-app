import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';


export default function UserProfile(){
    const dispatch = useDispatch();
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    const [photo, setPhoto] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
          if (!isAuthenticated || !token) return;
          setIsLoading(true);
          try {
            const response = await axios.get('http://localhost:8081/orders', {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            setOrders(response.data);
            setIsLoading(false);
          } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
            setIsAlertOpen(true);
            setIsLoading(false);
          }
        };
        fetchOrders();
    }, [isAuthenticated, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    

    
}