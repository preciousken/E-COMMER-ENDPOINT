import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utilities/response';
import {
  getAllAvailableMenus,
  addMenuToCart,
  removeMenuFromCart,
  getAUserCart,
} from '../dao/menu';

const getAllMenus = async (req: Request, res: Response) => {
  try {
    const found = await getAllAvailableMenus();
    if (found.status) {
      return sendSuccessResponse(res, found.message, found.data, 200);
    }
    return sendErrorResponse(res, found.message, {}, 400);
  } catch (error: any) {
    console.log(error);
    return sendErrorResponse(res, 'UNKNOWN_ERROR', {}, 500);
  }
};

const addMenuToUserCart = async (req: Request, res: Response) => {
  try {
    const done = await addMenuToCart(req.user, req.body);
    if (done.status) {
      return sendSuccessResponse(res, done.message, done.data, 200);
    }
    return sendErrorResponse(res, done.message, {}, 400);
  } catch (error: any) {
    console.log(error);
    return sendErrorResponse(res, 'UNKNOWN_ERROR', {}, 500);
  }
};

const removeMenuFromUserCart = async (req: Request, res: Response) => {
  try {
    const done = await removeMenuFromCart(req.user, req.body);
    if (done.status) {
      return sendSuccessResponse(res, done.message, done.data, 200);
    }
    return sendErrorResponse(res, done.message, {}, 400);
  } catch (error: any) {
    console.log(error);
    return sendErrorResponse(res, 'UNKNOWN_ERROR', {}, 500);
  }
};

const viewUserCart = async (req: Request, res: Response) => {
  try {
    const done = await getAUserCart(req.user);
    if (done.status) {
      return sendSuccessResponse(res, done.message, done.data, 200);
    }
    return sendErrorResponse(res, done.message, {}, 400);
  } catch (error: any) {
    console.log(error);
    return sendErrorResponse(res, 'UNKNOWN_ERROR', {}, 500);
  }
};

export { getAllMenus, addMenuToUserCart, removeMenuFromUserCart, viewUserCart };
