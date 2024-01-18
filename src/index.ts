import express from 'express';
import connectDB from "./services/Database";
import {AdminRoute, CustomerRoute, DeliveryRoute, ShoppingRoute, VendorRoute} from "./routes";
import dotenv from 'dotenv';

dotenv.config({
    path:"../.env"
})
const PORT=process.env.PORT||3000;
const startServer=async ()=>{

    const app=express();
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use('/api/v1/admins',AdminRoute);
    app.use('/api/v1/vendors',VendorRoute);
    app.use('/api/v1/customers', CustomerRoute)
    app.use('/api/v1/deliverys', DeliveryRoute);
    app.use(ShoppingRoute);
    app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    })
}
connectDB().then(()=>startServer());