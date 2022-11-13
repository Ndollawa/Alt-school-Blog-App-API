import  express from 'express';
const router = express.Router();
import path from 'path';
import RegisterController  from '../../controllers/RegisterController.js';

router.route('/')
.get((req, res,next)=>RegisterController.index(req, res,next))
.post((req, res,next)=>RegisterController.register(req, res,next))

export default router;  