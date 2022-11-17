import { NextFunction, Response, Request } from 'express';
import Joi from 'joi';
import {
  handleValidationError,
  sendErrorResponse,
  sendSuccessResponse,
} from '../utilities/response';
import { verifyUserToken } from '../dao/user';

const registerPayloadValidation = (payload: object) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    password: Joi.string().required(),
  }).required();
  return schema.validate(payload, { allowUnknown: true });
};

const validateRegisterPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validated = registerPayloadValidation(req.body);
  if (validated.error) {
    return handleValidationError(validated, res);
  }
  return next();
};

const loginPayloadValidation = (payload: object) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required();
  return schema.validate(payload, { allowUnknown: true });
};

const validateLoginPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validated = loginPayloadValidation(req.body);
  if (validated.error) {
    return handleValidationError(validated, res);
  }
  return next();
};

const authTokenRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return sendErrorResponse(res, 'TOKEN_ERROR', {}, 401);
  }
  const verified = await verifyUserToken(token.split(' ')[1]);
  if (!verified.status) {
    return sendErrorResponse(res, verified.message, {}, 401);
  }
  req.user = verified.data;
  return next();
};

const deleteUserPayloadValidation = (payload: object) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  }).required();
  return schema.validate(payload, { allowUnknown: true });
};

const validatedeleteUserPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validated = deleteUserPayloadValidation(req.body);
  if (validated.error) {
    return handleValidationError(validated, res);
  }
  return next();
};

export {
  validateRegisterPayload,
  validateLoginPayload,
  authTokenRequired,
  validatedeleteUserPayload,
};
