import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const Schema = mongoose.Schema;

const UserSchema =  new Schema({
    first_name:{
        type:String,
    },
    last_name:{
        type:String,
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    username:{
        type:String
    },
    password:{
        type:String,
        required: true
    },
     phone:{
        type:String
    },
    dob:{
        type:String
    },
    roles:{
       Author:{
        type: Number,
        default: 3
       },
       Editor: Number,
       Admin: Number
    },
    user_image:{
        type:String
    },
    refreshToken: String


},
{timestamps:true});
UserSchema.plugin(mongoosePaginate);

export default mongoose.model('User',UserSchema);