import Joi from 'joi';

export const createPostValidator = Joi.object({
  title: Joi.string().min(3).required(),
  body: Joi.string().min(60).required(),
}).required();

export const updatePostValidator = Joi.object({
  title: Joi.string().min(3),
  body: Joi.string().min(60),
}).min(1);
