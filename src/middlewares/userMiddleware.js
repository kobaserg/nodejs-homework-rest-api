const jwt = require("jsonwebtoken");
const { Users } = require("../db/usersModel");
const { NotAuthorizedError } = require("../helpers/errors");

const userTokenMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new NotAuthorizedError("Please, provide a token"));
  }

  const [, token] = authorization.split(" ");

  if (!token) {
    next(new NotAuthorizedError("Please, provide a correct token"));
  }

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(_id);

    if (!user || !user.token) {
      next(new NotAuthorizedError("Not authorized"));
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    next(new NotAuthorizedError("Invalid token"));
  }
};

module.exports = {
  userTokenMiddleware,
};
