import crypto from 'node:crypto';
import {AuthPayload} from "../validators";
import jwt from 'jsonwebtoken';
import {Request} from "express";


export const generateSalt=async(length:number)=>{
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0,length);
}

export const generatePassword=async(password:string,salt:string)=>{
        const hmac=crypto.createHmac('sha256',salt);
        hmac.update(password);
    return hmac.digest('hex');
}

export const validatePassword=async(userPassword:string,password:string,salt:string)=>{
    const hashedPassword=await generatePassword(userPassword,salt);
    return hashedPassword===password;
}

export const generateAccessToken=async(payload:AuthPayload)=>{
    return jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )
}
export const generateRefreshToken=async(id:string)=>{
    return jwt.sign(
        {_id:id},
                process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const generateAcessAndRefreshToken=async(payload:AuthPayload)=>{
    const accessToken=await generateAccessToken(payload);
    const refreshToken=await generateRefreshToken(payload._id);
    return {accessToken,refreshToken};
}

export const verifyAccessToken=async(req:Request)=>{
        const accessToken=req.get("Authorization");
        if(accessToken){
            req.user=jwt.verify(accessToken.split(' ')[1], process.env.ACCESS_TOKEN_SECRET!) as AuthPayload;
            return true;
        }
        return false;
}

export const generateOTP=()=>{
    const OTP = Math.floor(10000 + Math.random() * 900000);
    let OTPExpiry = new Date()
    OTPExpiry.setTime(new Date().getTime() + (30 * 60 * 1000));

    return {OTP,  OTPExpiry};
}

export const sendOTP=async (otp:number,phone:string)=>{
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;
    const client = require('twilio')(accountSid, authToken);
    try{
        return await client.messages.create({
            body: `Your OTP is ${otp}`,
            messagingServiceSid: 'MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            to: `+91${phone}`
        });
    }
    catch(error){
        return false;
    }

}