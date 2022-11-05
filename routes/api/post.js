import express from 'express';
const router = express.Router();
import path from 'path';
import ROLES_LIST from '../../config/roleList.js';
import verifyRoles from '../../middleware/verifyRoles.js';

import PostController from '../../controllers/PostController.js';
let PostHandler = new PostController();

router.route('/')
.get((req, res, next) => PostHandler.index(req, res, next))
.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Author), (req, res, next) => PostHandler.create(req, res, next))
.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Author), (req, res, next) => PostHandler.update(req, res, next))
.delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Author), (req, res, next) => PostHandler.delete(req, res, next))

export default  router; 