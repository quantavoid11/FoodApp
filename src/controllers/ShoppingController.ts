import {Request,Response} from "express";
import {Vendor} from "../models";
import {ApiResponse} from "../utils";

export const getFoodAvailability=async(req:Request,res:Response)=>{
    const pincode=req.params.pincode;
    const availableFoods=await Vendor.find({pincode:pincode,serviceAvailable:true}).sort([['rating','descending']]).populate('foods');
    if(availableFoods.length>0){
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {foods:availableFoods},
                    "Available Foods fetched successfully"
                )
            );
    }
    return res
        .status(404)
        .json(
            new ApiResponse(
                404,
                "",
                'Data not found.')
        );
}

export const getTopRestaurants=async(req:Request,res:Response)=>{
    const pincode=req.params.pincode;
    const topRestaurants=await Vendor.find({pincode:pincode,serviceAvailable:true}).sort([['rating','descending']]).limit(15);
    if(topRestaurants.length>0){
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {Restaurants:topRestaurants},
                    "Top restaurants fetched successfully"
                )
            );
    }
    return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                "",
                'Data not found')
        );
}

export const findFoods=async(req:Request,res:Response)=>{
    const pincode=req.params.pincode;
    const foods=await Vendor.find({pincode:pincode,serviceAvailable:true}).populate('foods');
    if(foods.length>0){
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {Foods:foods},
                    "Foods fetched successfully"
                )
            );
    }
    return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                "",
                'Data not found')
        );
}
export const getFoodsByRestaurantId=async(req:Request,res:Response)=>{
    const id=req.params.id;
    const foods=await Vendor.findById(id).populate('foods');
    if(foods){
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {Foods:foods},
                    "Foods fetched successfully"
                )
            );
    }
    return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                "",
                'Data not found')
        );
}



