import express from 'express';
const router = express.Router();
import path  from 'path';
import ROLES_LIST  from '../../config/roleList.js';
import verifyRoles  from '../../middleware/verifyRoles.js';
import UserController from '../../controllers/UserController.js';




router.route('/')
.get((req, res, next) => UserController.index(req, res, next))
.post((req, res, next) => UserController.create(req, res, next))
.put((req, res, next) => UserController.update(req, res, next))
.delete((req, res, next) => UserController.delete(req, res, next))
export default router; 