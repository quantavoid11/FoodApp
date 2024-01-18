import express from "express";
import {
    findFoods,
    getFoodAvailability,
    getFoodsByRestaurantId,
    getTopRestaurants
} from "../controllers";

const router=express.Router();

router.route('/:pincode')
    .get(getFoodAvailability)

router.route('/topRestaurants/:pincode')
    .get(getTopRestaurants)

router.route('/foods/:pincode')
    .get(findFoods)
router.route('/restaurant/:id')
    .get(getFoodsByRestaurantId)
export {router as ShoppingRoute}