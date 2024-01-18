import mongoose,{Document,Schema} from "mongoose";

interface vendorDoc extends Document {
    name:string;
    ownername:string;
    address:string;
    pincode:string;
    email:string;
    foodType:[string];
    phone:string;
    password:string;
    salt:string;
    rating:number;
    latitude:number;
    langitude:number;
    serviceAvailable:boolean;
    foods:any;
    refreshToken:string
}

const vendorSchema=new Schema({
        name:{
            type:String,
            required:true
        },
        ownerName:{
            type:String,
            required: true
        },
        address:{
            type:String,
            required:true
        },
        pincode:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        foodType:{
            type:[String],
            required:true
        },
        phone:{
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
        rating:{
            type:Number,
        },
        latitude:{
            type:Number,
        },
        langitude:{
            type:Number,
        },
        serviceAvailable:{
            type:Boolean,
        },
        foods:[{
            type:mongoose.SchemaTypes.ObjectId,
            ref:'Food'
        }],
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

export const Vendor=mongoose.model<vendorDoc>('Vendor',vendorSchema);