import mongoose,{Document,Schema} from "mongoose";

interface customerDoc extends Document {
    name:string;
    address:string;
    email:string;
    phoneNumber:string;
    password:string;
    salt:string;
    OTP:number;
    OTPExpiry:Date;
    latitude:number;
    langitude:number;
    verified:boolean;
    refreshToken:string
}

const customerSchema=new Schema({
        name:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        salt:{
            type:String,
        },

        latitude:{
            type:Number,
        },
        langitude:{
            type:Number,
        },
        verified:{
            type:Boolean,
        },
        OTP:{
            type:Number
        },
        OTPExpiry:{
            type:Date
        },
        refreshToken:{
            type:String
        }
    },
    {
        toJSON:{
            transform(doc,ret){
                delete ret.password;
                delete ret.salt;
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
                delete ret.refreshToken;
            }
        },
        timestamps:true
    }
)

export const Customer=mongoose.model<customerDoc>('Customer',customerSchema);