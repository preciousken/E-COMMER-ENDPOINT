import { Router } from 'express';

const baseRouter = Router();

import * as base from '../controllers/base';

baseRouter.get('/', base.base);
baseRouter.get('/success', base.paymentSuccess);
baseRouter.get('/cancel', base.paymentFailed);

export default baseRouter;
