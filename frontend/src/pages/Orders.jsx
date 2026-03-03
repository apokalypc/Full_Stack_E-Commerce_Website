import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrderData = async () => {
    try {
      if (!token) {
        setLoading(false)
        return
      }

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      )

      console.log("Orders response:", response.data)

      if (response.data.success) {
        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )
        setOrderData(sortedOrders)
      }
    } catch (error) {
      console.log("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  // Only load orders once token is ready
  useEffect(() => {
    if (token) {
      loadOrderData()
    }
  }, [token])

  const formatDateTime = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(dateString).toLocaleString(undefined, options)
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading orders...</div>
      ) : orderData.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No orders found</p>
      ) : (
        <div>
          {orderData.map((order, orderIndex) => (
            <div
              key={orderIndex}
              className='py-6 border-t border-b text-gray-700 flex flex-col gap-6'
            >
              {/* Order header */}
              <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
                <p className='text-sm text-gray-500'>
                  Order Date: {formatDateTime(order.date)}
                </p>
                <p className='text-sm font-medium'>
                  Payment: {order.paymentMethod}
                </p>
              </div>

              {/* Order items */}
              {order.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 border p-4 rounded'
                >
                  <div className='flex items-start gap-6 text-sm'>
                    <img
                      className='w-16 sm:w-20'
                      src={item.image[0]}
                      alt={item.name}
                    />
                    <div>
                      <p className='sm:text-base font-medium'>{item.name}</p>
                      <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                        <p className='text-lg'>
                          {currency}{item.price}
                        </p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Size: {item.size}</p>
                      </div>
                    </div>
                  </div>

                  <div className='md:w-1/2 flex justify-between'>
                    <div className='flex items-center gap-2'>
                      <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                      <p className='text-sm md:text-base'>
                        {order.status || "Order placed"}
                      </p>
                    </div>
                    <button className='border px-4 py-2 text-sm font-medium rounded-sm'>
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
