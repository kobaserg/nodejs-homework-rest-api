const serviceUsers = require("../services/usersService");

const userSignupController = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await serviceUsers.userSignup(email, password);
  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },

    status: `Signup with email : ${email} and password : ${password} successfully`,
  });
};

const userLoginController = async (req, res, next) => {
  const { email, password } = req.body;
  const token = await serviceUsers.userLogin(email, password);
  res.status(200).json({
    token,
    user: {
      email,
      password,
    },
    status: `Login for email : '${email}' and password : '${password}' successfully`,
  });
};

const userLogoutController = async (req, res, next) => {
  const { id } = req.params;
  await serviceUsers.userLogout(id);
  res.status(204).json({
    message: `Logout for id : '${id}'  successfully`,
  });
};

const getUserContactsController = async (req, res, next) => {
  const token = req.token;
  const user = await serviceUsers.currentUser(token);
  res.status(200).json({ user, status: "Current user successfully" });
};

const userSubscriptionController = async (req, res, next) => {
  const user = await serviceUsers.userSubsciption(req);
  const { email, subscription } = user;
  res.status(200).json({
    email,
    subscription,
    status: "User's subscription status change successfully",
  });
};

module.exports = {
  userSignupController,
  userLoginController,
  userLogoutController,
  getUserContactsController,
  userSubscriptionController,
};
