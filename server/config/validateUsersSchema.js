import joi from "joi";

const validateUserRegister = (data) => {
  const schema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data, { abortEarly: false });
};

const validateUserLogin = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data, { abortEarly: false });
};

export { validateUserRegister, validateUserLogin };
