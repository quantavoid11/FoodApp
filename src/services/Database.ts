import mongoose from 'mongoose';
const connectDB=async ()=>{
        try {
            const connectionInstance=await mongoose.connect(process.env.MONGODB_URI!);
            console.log(
                `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
            );
        }
        catch (err) {
            console.log("Mongodb connection error : ",err);
            process.exit(1);
        }
}
export default connectDB;