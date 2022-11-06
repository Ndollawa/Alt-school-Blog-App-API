import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema =  new Schema({
    author:{
        type:mongoose.ObjectId,
        required: true
    },
    title:{
        type:String,
        required: true,
        unique: true
    },
    body:{
        type:String,
        required: true
    },
    description:{
        type:String
        
    },
    tags:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    state:{
        type:String,
        default:'draft',
        required: true   
    },
    read_count:{
        type:Number,
        default:0
    },
    reading_time:{
        type:String
    }

},
{timestamps:true});

export default mongoose.model('Post',PostSchema);