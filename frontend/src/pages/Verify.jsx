import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';


const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const userId = searchParams.get('userId');

    const verifyPayment = async () => {
        try {

            if (!token) {
                return null;
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', { orderId, success, userId }, { headers: { token } })

            if (response.data.success) {
                setCartItems({});
                navigate('/orders');
            } else {
                navigate('/cart');
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message) // Show error message from catch block
            
        }
    }

    useEffect(() => {

        verifyPayment();

    }, [token])


    return (
        <div>

        </div>
    )
}

export default Verify
