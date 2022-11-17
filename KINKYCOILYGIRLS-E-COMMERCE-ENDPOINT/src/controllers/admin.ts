import { Request, Response } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utilities/response';
import { destroyAUser } from '../dao/user';
import { createAMenu } from '../dao/menu';

const deleteAUser = async (req: Request, res: Response) => {
  try {
    const found = await destroyAUser(req.body.email);
    if (found.status) {
      return sendSuccessResponse(res, found.message, found.data, 200);
    }
    return sendErrorResponse(res, found.message, {}, 400);
  } catch (error: any) {
    console.log(error);
    return sendErrorResponse(res, 'UNKNOWN_ERROR', {}, 500);
  }
};

const publishMenu = async (req: Request, res: Response) => {
  try {
    const menu = await createAMenu(req.body);
    if (menu.status) {
      return sendSuccessResponse(res, menu.message, menu.data, 200);
    }
    return sendErrorResponse(res, menu.message, {}, 400);
  } catch (error: any) {
    console.log(error);
    return sendErrorResponse(res, 'UNKNOWN_ERROR', {}, 500);
  }
};

export { deleteAUser, publishMenu };
