import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema =  new Schema({
    first_name:{
        type:String,
        required: true
    },
    last_name:{
        type:String,
        required: true
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
    refreshToken: String,
    created_at:{
        type:Date,
        default: Date.now,
        required: true
    },
    updated_at:{
        type:Date,
        default:Date.now
        // required: true
    }

});

export default mongoose.model('User',UserSchema);