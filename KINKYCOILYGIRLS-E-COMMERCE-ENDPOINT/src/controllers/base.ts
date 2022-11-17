import { Request, Response } from 'express';
import { sendSuccessResponse } from '../utilities/response';

// base endpoint
const base = (req: Request, res: Response) => {
  return sendSuccessResponse(res, 'Welcome to the base endpoint', {});
};

const paymentSuccess = (req: Request, res: Response) => {
  return sendSuccessResponse(res, 'Payment completed successfully', {});
};

const paymentFailed = (req: Request, res: Response) => {
  return sendSuccessResponse(res, 'Payment cancelled 😢', {});
};

export { base, paymentSuccess, paymentFailed };
