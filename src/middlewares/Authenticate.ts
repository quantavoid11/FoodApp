import {AuthPayload} from "../validators";
import {Request,Response,NextFunction} from "express";
import {ApiResponse, verifyAccessToken} from "../utils";

declare global {
    namespace Express{
        interface Request{
            user?: AuthPayload
        }
    }
}

export const authenticate=async (req:Request,res:Response,next:NextFunction)=>{
    const verified=await verifyAccessToken(req);
    if(verified){
        return next();
    }
    else{
        return res
            .status(401)
            .json(
                new ApiResponse(
                    401,
                    "",
                    "User not authorised"
                )
            )
    }
}