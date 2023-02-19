const jwt = require("jsonwebtoken");
const { NotAuthorizedError } = require("../helpers/errors");

const userTokenMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      next(new NotAuthorizedError("Please, provide a token"));
    }

    const [typeToken, token] = authorization.split(" ");

    if (!token || typeToken !== "Bearer") {
      next(new NotAuthorizedError("Please, provide a correct token"));
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      next(new NotAuthorizedError("Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new NotAuthorizedError("Invalid token"));
  }
};

module.exports = {
  userTokenMiddleware,
};
