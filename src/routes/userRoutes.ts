import { Router } from 'express';
import * as UserController from '../controllers/userController';

const router = Router();

router.post('/', UserController.createNewUser);
router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUserById);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);
router.get('/:userId/orders/total-price', UserController.calculateTotalPrice);
router.get('/:userId/orders', UserController.getAllOrdersForUser);

export default router;
