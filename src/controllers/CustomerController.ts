import {Request,Response} from "express";
import {plainToClass, plainToClassFromExist, plainToInstance} from "class-transformer";
import {loginCustomerInput, registerCustomerInput} from "../validators";
import {validate} from "class-validator";
import {
    ApiResponse,
    generateAcessAndRefreshToken,
    generateOTP,
    generatePassword,
    generateSalt,
    sendOTP, validatePassword
} from "../utils";
import {Customer, Vendor} from "../models";
import {findVendor} from "./AdminController";



export const findCustomer=async(id:string|undefined,email?:string,phone?:string)=>{
    if(email||phone){
        return Customer.findOne({$or:[{email: email},{phone:phone}]
        });}
    else{
        return Customer.findById(id)
    }
}

export const registerCustomer=async(req:Request,res:Response)=>{
        const customerInputs=plainToInstance(registerCustomerInput,req.body);
        const validationError=await validate(customerInputs,{validationError:{target:true}});
        if(validationError.length>0){
            res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        {Errors:validationError},
                        'Enter Correct Inputs')
                );
        }
        const {email,phoneNumber,password,name,address}=customerInputs;
        const customerExists=await findCustomer('',email,phoneNumber);
        if(customerExists){
            return res
                .status(409)
                .json(
                    new ApiResponse(
                        409,
                        {email:email,phoneNumber:phoneNumber},
                        "Customer with this email or phone already exists"
                    )
                );
        }

    const salt=await generateSalt(16);
    const customerPassword=await generatePassword(password,salt);
    const {OTP,OTPExpiry}=generateOTP();
    try{
        const customer= await Customer.create({
            name: name,
            address: address,
            email: email,
            password: customerPassword,
            salt: salt,
            phoneNumber: phoneNumber,
            OTP:OTP,
            OTPExpiry:OTPExpiry,
            verified: false,
            latitude: 0,
            langitude: 0
        });

        await sendOTP(OTP,phoneNumber);
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    {customer:customer},
                    "Customer created successfully"
                )
            );

    }
    catch (error) {
        return res
            .status(500)
            .json(
                new ApiResponse(
                    500,
                    {error:error},
                    "Error while creating user"
                )
            );
    }

}
export const loginCustomer=async(req:Request,res:Response)=>{
    const customerInputs=plainToInstance(loginCustomerInput,req.body);
    const validationError=await validate(customerInputs,{validationError:{target:true}});
    if(validationError.length>0){
      return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    {Errors:validationError},
                    'Enter Correct Inputs')
            );
    }
    const {email,password}=customerInputs;
    const customer=await findCustomer('',email);
    if(!customer){
        return res
            .status(404)
            .json(
                new ApiResponse(
                    404,
                    {email:email},
                    'Customer with this email id does not exists')
            );
    }
    const validation=await validatePassword(password,customer.password,customer.salt);
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
        _id:customer._id,
        name:customer.name,
        email:customer.email,
        verified:customer.verified
    });
    customer.refreshToken=refreshToken;
    await customer.save();
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
                {customer:customer},
                "Customer logged in successfully"
            )
        );
}
export const requestOTP=async(req:Request,res:Response)=>{
    const customer=req.user;
    if(customer){
        const profile=await Customer.findById(customer._id);
        if(profile){
            const {OTP,OTPExpiry}=generateOTP();
            profile.OTP=OTP;
            profile.OTPExpiry=OTPExpiry;
            await profile.save();
            const codeSent= await sendOTP(OTP,profile.phoneNumber);
            if(!codeSent){
                return res
                    .status(400)
                    .json(
                        new ApiResponse(
                            400,
                            {},
                            "Error while generating otp"
                        )
                    );
            }
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        {customer:customer},
                        "OTP sent to your registered mobile number"
                    )
                );


        }
    }
}
export const verifyCustomer=async(req:Request,res:Response)=>{
        const {OTP}=req.body;
        const customer=req.user;
        if(customer){
            const profile=await Customer.findById(customer._id);
            if(profile){
                if(profile.OTP==OTP && profile.OTPExpiry>=new Date()){
                        profile.verified=true;
                    const {accessToken,refreshToken}=await generateAcessAndRefreshToken({
                        _id:profile._id,
                        name:profile.name,
                        email:profile.email,
                        verified:profile.verified
                    });
                    profile.refreshToken=refreshToken;
                    const verifiedCustomer=await profile.save();
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
                                {customer:profile},
                                "Customer verified successfully"
                            )
                        );
                }
            }
        }
}
export const getCustomerProfile=async(req:Request,res:Response)=>{
        const customer=req.user;
        if(customer){
            const profile=await Customer.findById(customer._id);
            if(profile){
                return res
                    .status(200)
                    .json(
                        new ApiResponse(
                            200,
                            {customer:profile},
                            "Customer's profile fetched successfully"
                        )
                    );

            }
        }
}
export const updateCustomerProfile=async(req:Request,res:Response)=>{

}
export const addToCart=async (req:Request,res:Response)=>{

}
export const getCartItems=async(req:Request,res:Response)=>{

}
export const deleteCartItems=async(req:Request,res:Response)=>{

}
export const verifyOffer=async(req:Request,res:Response)=>{

}
export const makePayment=async(req:Request,res:Response)=>{

}
export const createOrder=async(req:Request,res:Response)=>{
        const customer=req.user;
        if(customer){

            const orderId=`${Math.floor(Math.random() * 89999)+ 1000}`
            const profile=await Customer.findById(customer._id);

        }
}
export const getOrders=async(req:Request,res:Response)=>{

}
export const getOrderById=async(req:Request,res:Response)=>{

}
export const deleteOrder=async(req:Request,res:Response)=>{

}

