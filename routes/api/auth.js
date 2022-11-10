import  express from 'express';
const router = express.Router();
import path from 'path';
import AuthController from '../../controllers/AuthController.js';

router.route('/')
.get((req, res,next)=>AuthController.index(req, res,next))
.post((req, res,next)=>AuthController.login(req, res,next))

export default router;  