import express from 'express';
import { getUsers, addUser, login, logout, geheimnis } from '../controllers/userController.js';
import auth from '../middleware/auth.js';


const router = express.Router();

router.route('/').get(getUsers).post(addUser);

router.route('/login').post(login);

router.route('/logout').post(logout);

router.route('/geheim').get(auth, geheimnis);

export default router;