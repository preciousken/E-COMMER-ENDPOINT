import { Router } from 'express';
import {
  validateRegisterPayload,
  validateLoginPayload,
  authTokenRequired,
} from '../validations/user';

const userRouter = Router();

import * as controller from '../controllers/user';

userRouter.post('/register', validateRegisterPayload, controller.register);
userRouter.post('/login', validateLoginPayload, controller.login);
userRouter.put('/update', authTokenRequired, controller.updateAUser);
userRouter.get('/user', authTokenRequired, controller.getAUser);
userRouter.post('/order', authTokenRequired, controller.checkout);

export default userRouter;
