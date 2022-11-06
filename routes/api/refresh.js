import express from 'express';
const router = express.Router();
// import path  from 'path';
// import ROLES_LIST  from '../../config/roleList.js';
// import verifyRoles  from '../../middleware/verifyRoles.js';
import AuthController from '../../controllers/AuthController.js';




router.route('/')
.get((req, res, next) => AuthController.refreshTokenHandler(req, res, next))
export default router; 