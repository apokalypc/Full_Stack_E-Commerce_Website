import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'
import paypal from '@paypal/checkout-server-sdk'

// Helper: extract userId from JWT token
const getUserIdFromToken = (req) => {
  const token = req.headers.token
  if (!token) throw new Error("No token provided")

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  return decoded.id // assuming your JWT payload has { id: userId }
}

// Global variables
const currency = 'USD'
const deliveryCharge = 10

// Stripe initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// PayPal client setup
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
)
const client = new paypal.core.PayPalHttpClient(environment)

// ---------------- PLACE ORDER (COD) ----------------
const placeOrder = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req)
    const { items, amount, address } = req.body

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      status: "Order placed",
      date: Date.now(),
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    await userModel.findByIdAndUpdate(userId, { cartData: {} })

    res.json({ success: true, message: "Order Placed Successfully!" })
  } catch (error) {
    console.log("Error placing order:", error)
    res.json({ success: false, message: error.message })
  }
}

// ---------------- PLACE ORDER (Stripe) ----------------
const placeOrderStripe = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req)
    const { items, amount, address } = req.body
    const { origin } = req.headers

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      status: "Order placed",
      date: Date.now(),
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }))

    line_items.push({
      price_data: {
        currency,
        product_data: { name: 'Delivery Charges' },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    })

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    })

    res.json({ success: true, session_url: session.url })
  } catch (error) {
    console.log("Error placing Stripe order:", error)
    res.json({ success: false, message: error.message })
  }
}

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true })
      await userModel.findByIdAndUpdate(userId, { cartData: {} })
      res.json({ success: true, message: "Payment Verified" })
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false, message: "Payment Failed" })
    }
  } catch (error) {
    console.log("Error verifying Stripe order:", error)
    res.json({ success: false, message: error.message })
  }
}

// ---------------- PLACE ORDER (PayPal) ----------------
const placeOrderPayPal = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req)
    const { items, amount, address } = req.body
    const { origin } = req.headers

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "PayPal",
      payment: false,
      status: "Order placed",
      date: Date.now(),
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer("return=representation")
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: (amount + deliveryCharge).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount.toFixed(2),
              },
              shipping: {
                currency_code: currency,
                value: deliveryCharge.toFixed(2),
              },
            },
          },
          description: `Order #${newOrder._id}`,
        },
      ],
      application_context: {
        brand_name: "My E-Commerce Store",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      },
    })

    const order = await client.execute(request)

    res.json({
      success: true,
      orderId: newOrder._id,
      paypalOrderId: order.result.id,
      approvalUrl: order.result.links.find(link => link.rel === "approve").href,
    })
  } catch (error) {
    console.log("Error placing PayPal order:", error)
    res.json({ success: false, message: error.message })
  }
}

// Verify PayPal
const verifyPayPal = async (req, res) => {
  const { orderId, paypalOrderId, success, userId } = req.body

  try {
    if (success === "true") {
      const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId)
      request.requestBody({})
      const capture = await client.execute(request)

      if (capture.result.status === "COMPLETED") {
        await orderModel.findByIdAndUpdate(orderId, { payment: true })
        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        res.json({ success: true, message: "Payment Verified" })
      } else {
        res.json({ success: false, message: "Payment not completed" })
      }
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false, message: "Payment Failed" })
    }
  } catch (error) {
    console.log("Error verifying PayPal order:", error)
    res.json({ success: false, message: error.message })
  }
}

// ---------------- ADMIN: ALL ORDERS ----------------
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({ success: true, orders })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// ---------------- USER: MY ORDERS ----------------
const userOrders = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req)
    const orders = await orderModel.find({ userId })
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// ---------------- UPDATE STATUS ----------------
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body
    await orderModel.findByIdAndUpdate(orderId, { status })
    res.json({ success: true, message: "Status Updated" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderPayPal,
  verifyPayPal,
  allOrders,
  userOrders,
  updateStatus
}
