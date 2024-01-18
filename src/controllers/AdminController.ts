import { Request, Response, NextFunction } from 'express';
import {Vendor} from '../models'
import {ApiResponse} from "../utils";
import {generateSalt,generatePassword} from "../utils";
import {createVednorInput} from "../validators";

export const findVendor=async(id:string|undefined,email?:string,phone?:string)=>{
        if(email||phone){
            return Vendor.findOne({$or:[{email: email},{phone:phone}]
        });}
        else{
            return Vendor.findById(id)
        }
}
export const createVendor=async(req:Request,res:Response,next:NextFunction)=>{
    const { name, address, pincode, foodType, email, password, ownerName, phone }  =<createVednorInput> req.body;
    const vendorExists=await findVendor('',email,phone);
    if(vendorExists){
        return res
            .status(409)
            .json(
                new ApiResponse(
                    409,
                    {email,phone},
                    "Vendor with this email or phone already exists"
                )
            );

    }
    const salt=await generateSalt(16);
    const userPassword=await generatePassword(password,salt);
    const createdVendor= await Vendor.create({
        name: name,
        address: address,
        pincode: pincode,
        foodType: foodType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        latitude: 0,
        langitude: 0
    })
    return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    {vendor:createdVendor},
                    "Vendor created successfully"
                )
            );

};
export const getVendors=async(req:Request,res:Response,next:NextFunction)=>{
    const vendors=await Vendor.find();
    if(vendors){
        return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {vendors:vendors},
                        "Vendors fetched successfully"
                    )
                )
    }

    return res
            .status(404)
            .json(
                new ApiResponse(
                    404,
                    "",
                    "Vendors does not exist"
                )
            )
};
export const getVendorById=async(req:Request,res:Response,next:NextFunction)=>{
    const vendorId=req.params.id;

    try{
        const vendor=await Vendor.findById(vendorId);
        if(vendor){
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {vendor:vendor},
                        "Vendor fetched successfully"
                    )
                );
        }
        return res
            .status(404)
            .json(
                new ApiResponse(
                    404,
                    "",
                    "Vendor does not exist"
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
                    "Incorrect vendor id"
                )
            );
    }

};

export const deleteVendor=async(req:Request,res:Response,next:NextFunction)=>{
    const vendorId=req.params.id;

    try{
        const vendor=await Vendor.findByIdAndDelete(vendorId);

        if(vendor){
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {vendor:vendor},
                        "Vendor deleted successfully"
                    )
                );
        }
        return res
            .status(404)
            .json(
                new ApiResponse(
                    404,
                    "",
                    "Vendor does not exist"
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
                    "Enter correct id"
                )
            );
    }
}

