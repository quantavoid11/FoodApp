import express from "express";
import {authenticate} from "../middlewares/Authenticate";
import {
    addToCart, createOrder, deleteCartItems, deleteOrder, getCartItems,
    getCustomerProfile, getOrderById, getOrders,
    loginCustomer, makePayment,
    registerCustomer,
    requestOTP,
    updateCustomerProfile,
    verifyCustomer, verifyOffer
} from "../controllers";

const router=express.Router();

router.route('/signup')
    .post(registerCustomer);

router.route('/login')
    .get(loginCustomer);

router.use(authenticate);

router.route('/otp')
    .get(requestOTP)

router.route('/verify')
    .patch(verifyCustomer)

router.route('/profile')
    .get(getCustomerProfile)
    .patch(updateCustomerProfile)

router.route('/cart')
    .post(addToCart)
    .get(getCartItems)
    .delete(deleteCartItems)

router.route('/verify/offer/:id')
    .get(verifyOffer)

router.route('/payment')
    .post(makePayment)

router.route('/order')
    .post(createOrder)

router.route('/orders')
    .get(getOrders)

router.route('/order/:id')
    .get(getOrderById)
    .delete(deleteOrder)



export {router as CustomerRoute}