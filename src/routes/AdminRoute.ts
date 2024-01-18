import express from "express";
import {createVendor,getVendors,getVendorById,deleteVendor} from '../controllers';
const router=express.Router();

router
    .route('/vendor')
    .post(createVendor);

router
    .route('/vendors')
    .get(getVendors);

router
    .route('/vendors/:id')
    .get(getVendorById)
    .delete(deleteVendor);

export  {router as AdminRoute};
