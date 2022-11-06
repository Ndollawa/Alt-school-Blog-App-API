import dotenv from 'dotenv'
dotenv.config(); 

import express, { application } from "express";
import path from 'path';
import cors from 'cors';
import { logger} from './middleware/logEvents.js';
import errorHandler from './middleware/errorHandler.js';
import corsOptions from './config/corsOptions.js';
import verifyJWT from './middleware/verifyJWT.js';
import cookieParser from 'cookie-parser';
import credentials from './middleware/credentials.js';
import mongoose from 'mongoose';
import connectDB from './config/dbConn.js';
import PostRoutes from './routes/api/post.js';
import UserRoutes from './routes/api/user.js';
import RefreshRoute from './routes/api/refresh.js';
// import CategoryRoutes from './routes/api/category.js';
import AuthController from './controllers/AuthController.js';



// connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3500

// custom middleware logger
app.use(logger);

//Handle credentials check before cors
app.use(credentials);

//Cross origin Resource Sharing
app.use(cors(corsOptions));


// built-in middleware to handle urlencodedn data
//in other words, form data
//content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());
///routes
app.get("/", (req, res)=>{
    res.send("Hello World!");
});


app.use('/register', (req, res, next) =>AuthController.register(req, res, next));
app.use('/login', (req, res, next) =>AuthController.login(req, res, next));
app.use('/refresh',RefreshRoute);
app.use('/logout', (req, res, next) =>AuthController.logout(req, res, next));

//post routes
app.use('/post', PostRoutes);
app.use(verifyJWT);


//user routes
app.use('/user', UserRoutes);
app.all('*',(req,res)=>{
    res.status(404);
});

// custom middleware for handling errors
app.use(errorHandler);

mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=>console.log(`Server running on Port ${PORT}`));

});
