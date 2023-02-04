const { Users } = require("../db/usersModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { NotAuthorizedError, ConflictError } = require("../helpers/errors");

const userSignup = async (email, password) => {
  const user = new Users({
    email,
    password,
  });

  if (await Users.findOne({ email })) {
    throw new ConflictError(`message: Email: '${email}' in use`);
  }

  await user.save();
  return user;
};

const userLogin = async (email, password) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new NotAuthorizedError(`User with email: '${email}' not found`);
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new NotAuthorizedError(`Wrong password: '${password}' `);
  }
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );
  await user.update({ token });
  return { token, user };
};

const userLogout = async (id) => {
  const user = await Users.findOne({ _id: id });
  if (!user) {
    throw new NotAuthorizedError(`User with id: '${id}' not found`);
  }

  return await user.update({ token: null });
};

const userSubsciption = async (email, subscription) => {
  const updateUserSubscrip = await Users.findOneAndUpdate(
    { email: email },
    { $set: { subscription } }
  );
  return updateUserSubscrip;
};

module.exports = {
  userSignup,
  userLogin,
  userLogout,
  userSubsciption,
};
