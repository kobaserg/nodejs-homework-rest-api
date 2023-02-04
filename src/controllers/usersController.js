const serviceUsers = require("../services/usersService");

const userSignupController = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await serviceUsers.userSignup(email, password);
  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
    },

    status: `Signup with email : ${email} successfully`,
  });
};

const userLoginController = async (req, res, next) => {
  const { email, password } = req.body;
  const { token, user } = await serviceUsers.userLogin(email, password);
  const id = user._id;
  res.status(200).json({
    token,
    user: {
      id,
      email,
    },
    status: `Login for email : '${email}'  successfully`,
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
  const user = req.user;
  const email = user.email;
  const subscription = user.subscription;

  res
    .status(200)
    .json({ email, subscription, status: "Current user successfully" });
};

const userSubscriptionController = async (req, res, next) => {
  const { subscription } = req.body;
  const user = req.user;
  const email = user.email;
  await serviceUsers.userSubsciption(email, subscription);

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
