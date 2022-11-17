import { NextFunction, Response, Request } from 'express';
import Joi from 'joi';
import { handleValidationError } from '../utilities/response';

const createMenuPayloadValidation = (payload: object) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    shipping: Joi.number().required(),
    description: Joi.string().required(),
  }).required();
  return schema.validate(payload, { allowUnknown: true });
};

const validateCreateMenuPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validated = createMenuPayloadValidation(req.body);
  if (validated.error) {
    return handleValidationError(validated, res);
  }
  return next();
};

const removeFromCartPayloadValidation = (payload: object) => {
  const schema = Joi.object({
    menuId: Joi.string().required(),
  }).required();
  return schema.validate(payload, { allowUnknown: true });
};

const validateRemoveFromCartPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validated = removeFromCartPayloadValidation(req.body);
  if (validated.error) {
    return handleValidationError(validated, res);
  }
  return next();
};

const addToCartPayloadValidation = (payload: object) => {
  const schema = Joi.object({
    menuId: Joi.string().required(),
    quantity: Joi.number().required(),
  }).required();
  return schema.validate(payload, { allowUnknown: true });
};

const validateAddToCartPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validated = addToCartPayloadValidation(req.body);
  if (validated.error) {
    return handleValidationError(validated, res);
  }
  return next();
};

export {
  validateCreateMenuPayload,
  validateAddToCartPayload,
  validateRemoveFromCartPayload,
};
