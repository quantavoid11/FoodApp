import mongoose,{Document,Schema} from "mongoose";

interface foodDoc extends Document{
    vendorId:string,
    name:string,
    description:string,
    category:string,
    foodType:string,
    price:number,
    rating:number,
    images:[string]
}

const foodSchema=new Schema(
    {
        vendorId:{
            type:mongoose.SchemaTypes.ObjectId,
            ref:'Vendor'
        },
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required: true
        },
        category:{
            type:String,
        },
        foodType:{
            type:String,
            required: true
        },
        price:{
            type:Number,
            required: true
        },
        rating: {
            type:Number
        },
        images:{
            type:[String]
        }
    },
    {
        toJSON:{
            transform(doc,ret){
                delete ret.createdAt
                delete ret.updatedAt
                delete ret.__v
            }
        },
        timestamps:true}
)

export const Food=mongoose.model<foodDoc>('Food',foodSchema);

