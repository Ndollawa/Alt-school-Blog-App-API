import mongoose from 'mongoose';


const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL,{
            useUnifiedTopology:true,
            useNewUrlParser: true
        });
    } catch(err){
        console.error(err);
    }
}

export default connectDB;