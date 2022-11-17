import handler from '../utilities/message';
import { Application, NextFunction, Request, Response } from 'express';
import { Keyable } from './interface';
import Joi from 'joi';

const makeResponse = (status: boolean, message: string, data: Keyable) => {
  if (status) {
    return {
      status,
      message: message,
      data: data,
    };
  }
  return {
    status,
    message: message,
    data: data,
  };
};

const sendSuccessResponse = (
  res: Response,
  message: string,
  data: object,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    status: true,
    message: handler.getMessage(message) || message,
    data: data,
  });
};

const sendErrorResponse = (
  res: Response,
  message: string,
  data: object,
  statusCode: number = 400
) => {
  return res.status(statusCode).json({
    status: false,
    message: handler.getMessage(message) || message,
    data: data,
  });
};

const handleValidationError = (validatedData: Keyable, res: Response) => {
  const message = validatedData.error.details[0].message;
  return sendErrorResponse(res, message, {}, 400);
};

export {
  sendSuccessResponse,
  sendErrorResponse,
  handleValidationError,
  makeResponse,
};
