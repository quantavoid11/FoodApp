import {NextFunction, Request, Response} from 'express';
import {findVendor} from "./AdminController";
import {ApiResponse, generateAcessAndRefreshToken, validatePassword} from "../utils";
import {createFoodInput, loginVendorInput, updateServiceInput, updateVendorInput} from "../validators";
import {Food, Vendor} from "../models";
import mongoose from "mongoose";

export const loginVendor=async(req:Request,res:Response)=>{
        const {email,password}=<loginVendorInput>req.body;
        if(!email){
            return res
                    .status(400)
                    .json(
                        new ApiResponse(
                            400,
                            {email:email},
                            'Email is required')
                    );
        }
        const vendor=await findVendor('',email);
        if(!vendor){
            return res
                .status(404)
                .json(
                    new ApiResponse(
                        404,
                        {email:email},
                        'Vendor with this email id does not exists')
                );
        }
            const validation=await validatePassword(password,vendor.password,vendor.salt);
            if(!validation){
                return res
                    .status(401)
                    .json(
                        new ApiResponse(
                            401,
                            {email:email,password:password},
                            'Invalid Credentials')
                    );
            }
            const {accessToken,refreshToken}=await generateAcessAndRefreshToken({
                _id:vendor._id,
                name:vendor.name,
                email:vendor.email
            });
            vendor.refreshToken=refreshToken;
            await vendor.save();
            const options={
                httpOnly:true,
                secure:true,
            }
            return res
                    .status(200)
                    .cookie("refreshToken",refreshToken,options)
                    .cookie("accessToken",accessToken,options)
                    .json(
                        new ApiResponse(
                            200,
                            {vendor:vendor},
                            "Vendor logged in successfully"
                        )
                    );
}


export const getVendorProfile=async(req:Request,res:Response)=>{
    const user = req.user;

    if(user){
        const vendor = await findVendor(user._id);
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {vendor:vendor},
                    "Vendor profile fetched successfully"
                )
            );
    }

    return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    {user:user},
                    'Vendor does not exist')
        );
}

export const updateVendorProfile=async(req:Request,res:Response)=>{
        const user=req.user;
        const updatedData=<updateVendorInput>req.body;
    if(user){
        const vendor = await findVendor(user._id);
        if(vendor){
            const updatedVendor=await Vendor.findByIdAndUpdate(user._id,updatedData,{new:true})
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {vendor:updatedVendor},
                        "Vendor Profile updated successfully"
                    )
                );
        }

    }
    return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                {user:user},
                'Vendor does not exist')
        );
}
export const updateVendorService=async(req:Request,res:Response)=>{
    const user=req.user;
    const {latitude,longitude}=<updateServiceInput>req.body;
    if(user){
        const vendor = await findVendor(user._id);
        if(vendor){
            vendor.serviceAvailable=!vendor.serviceAvailable;
            vendor.langitude=longitude;
            vendor.latitude=latitude;
            const updatedVendor=await vendor.save();
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {vendor:updatedVendor},
                        "Vendor Service updated successfully"
                    )
                );
        }

    }
    return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                {user:user},
                'Vendor does not exist')
        );
}

export const getFoods=async(req:Request,res:Response)=>{
    const user = req.user;
    if(user){
        const foods = await Food.find({vendorId:user._id});
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {foods:foods},
                    "Foods fetched successfully"
                )
            );
    }
    return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                {user:user},
                'Vendor does not exist')
        );
}
export const getFoodById=async(req:Request,res:Response)=>{
    const FoodId=req.params.id;
    try{
        const food=await Food.findById(FoodId);
        if(food){
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {food:food},
                        "Food fetched successfully"
                    )
                );
        }
        return res
            .status(404)
            .json(
                new ApiResponse(
                    404,
                    "",
                    "Food does not exist"
                )
            );
    }
    catch (err) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    "",
                    "Incorrect food id"
                )
            );
    }
}
export const addFood=async(req:Request,res:Response)=>{
        const user=req.user;
    const { name, description, category, foodType,  price } = <createFoodInput>req.body;
    if(user){
        const vendor=await Vendor.findById(user._id);
        if(vendor){

            const food=await Food.create({
                vendorId:vendor._id,
                name:name,
                description:description,
                category:category,
                foodType:foodType,
                price:price,
                rating:0,
                images:['image.jpg']
            })
            vendor.foods.push(food);
            const updatedVendor=await vendor.save();
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {vendor:updatedVendor},
                        "Food added successfully"
                    )
                );
        }
    }
    return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                {user:user},
                'Vendor does not exist')
        );
}