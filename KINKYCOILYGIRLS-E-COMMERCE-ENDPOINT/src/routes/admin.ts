import { Router } from 'express';
import { validatedeleteUserPayload } from '../validations/user';
import { validateCreateMenuPayload } from '../validations/menu';

const adminRouter = Router();

import * as controller from '../controllers/admin';

adminRouter.delete(
  '/user',
  [validatedeleteUserPayload],
  controller.deleteAUser
);

adminRouter.post('/menu', [validateCreateMenuPayload], controller.publishMenu);

export default adminRouter;
