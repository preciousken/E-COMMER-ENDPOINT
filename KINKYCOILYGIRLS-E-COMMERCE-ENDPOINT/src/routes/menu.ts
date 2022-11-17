import { Router } from 'express';
import { authTokenRequired } from '../validations/user';
import {
  validateAddToCartPayload,
  validateRemoveFromCartPayload,
} from '../validations/menu';

const menuRouter = Router();

import * as controller from '../controllers/menu';

menuRouter.get('/menus', [authTokenRequired], controller.getAllMenus);
menuRouter.post(
  '/cart/add',
  [authTokenRequired, validateAddToCartPayload],
  controller.addMenuToUserCart
);
menuRouter.delete(
  '/cart/remove',
  [authTokenRequired, validateRemoveFromCartPayload],
  controller.removeMenuFromUserCart
);
menuRouter.get('/cart/view', [authTokenRequired], controller.viewUserCart);

export default menuRouter;
