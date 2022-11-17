import { Application } from 'express';

import baseRouter from './base';
import userRouter from './user';
import adminRouter from './admin';
import menuRouter from './menu';

const index = (app: Application) => {
  app.use(baseRouter);
  app.use(userRouter);
  app.use('/admin', adminRouter);
  app.use(menuRouter);
};

export default index;
