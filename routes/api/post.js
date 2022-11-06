import express from 'express';
const router = express.Router();
import verifyJWT from '../../middleware/verifyJWT.js';
// import path from 'path';
import ROLES_LIST from '../../config/roleList.js';
import verifyRoles from '../../middleware/verifyRoles.js';

import PostController from '../../controllers/PostController.js';
let PostHandler = new PostController();

router.route('/')
.get((req, res, next) => PostHandler.index(req, res, next))
.post( verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Author), (req, res, next) => PostHandler.create(req, res, next));

router.route('/:id/')
.get((req, res, next) => PostHandler.show(req, res, next))
.post(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Author), (req, res, next) => PostHandler.update(req, res, next))
.put(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Author), (req, res, next) => PostHandler.update(req, res, next))
.delete(verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.Author), (req, res, next) => PostHandler.delete(req, res, next))


export default  router; 