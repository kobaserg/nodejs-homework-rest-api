const Joi = require("joi");

module.exports = {
  userSubsciptoinValidation: (req, res, next) => {
    const { subscription } = req.body;
    const schema = Joi.object({
      subscription: Joi.string().valid("starter", "pro", "business").required(),
    });
    const validationResult = schema.validate({ subscription });
    if (validationResult.error) {
      return res.status(400).json({
        message: "ERROR Validation Subscription",
        status: validationResult.error.details,
      });
    }
    next();
  },

  userValidation: (req, res, next) => {
    const { email, password } = req.body;
    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: Joi.string().max(30).required(),
    });

    const validationResult = schema.validate({ email, password });
    if (validationResult.error) {
      return res.status(400).json({
        message: "ERROR Validation User's",
        status: validationResult.error.details,
      });
    }
    next();
  },

  contactsValidation: (req, res, next) => {
    const { name, email, phone } = req.body;
    const schema = Joi.object({
      name: Joi.string().max(30).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      phone: Joi.number().required(),
      favorite: Joi.boolean(),
    });

    const validationResult = schema.validate({ name, email, phone });
    if (validationResult.error) {
      return res.status(400).json({
        message: "ERROR Validation Contacts",
        status: validationResult.error.details,
      });
    }
    next();
  },

  favoriteValidation: (req, res, next) => {
    const { favorite } = req.body;
    const schema = Joi.object({
      favorite: Joi.boolean().required(),
    });
    const validationResult = schema.validate({ favorite });
    if (validationResult.error) {
      return res.status(400).json({
        message: "ERROR Validation Favorite",
        status: validationResult.error.details,
      });
    }
    next();
  },
};
