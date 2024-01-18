import express from "express";
import {
    loginVendor,
    getVendorProfile,
    updateVendorProfile,
    updateVendorService,
    getFoods,
    addFood, getFoodById
} from "../controllers";
import {authenticate} from "../middlewares/Authenticate";

const router=express.Router();

router.route('/login')
    .post(loginVendor);

router.use(authenticate);

router.route('/profile')
    .get(getVendorProfile)
    .patch(updateVendorProfile)

router.route('/service')
    .patch(updateVendorService)

router.route('/foods')
    .get(getFoods)
    .post(addFood)

router.route('/food/:id')
    .get(getFoodById)
export {router as VendorRoute};