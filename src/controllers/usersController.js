const serviceUsers = require("../services/usersService");
const { v4: uuidv4 } = require("uuid");
const Jimp = require("jimp");
const fs = require("fs").promises;
const PORT = process.env.PORT;

const { Users } = require("../db/usersModel");

const userSignupController = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await serviceUsers.userSignup(email, password);
  res.status(201).json({
    user: {
      email: user.email,
      avatarURL: user.avatarURL,
      subscription: user.subscription,
    },

    status: `Signup with email : ${email} successfully`,
  });
};

const userVerifyController = async (req, res) => {
  const { verificationToken } = req.params;

  await serviceUsers.userVerify(verificationToken);

  res.json({ status: "Verification successful" });
};

const userEmailVerifyController = async (req, res) => {
  const { email } = req.body;
  await serviceUsers.userEmailVerify(email);
  res.json({ status: "Verification email sent" });
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
    status: `Logout for id : '${id}'  successfully`,
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

const uploadAvatarController = async (req, res) => {
  const { path: tmpUpload, originalname } = req.file;
  const [, extension] = originalname.split(".");

  const resultName = uuidv4() + "." + extension;
  const HOST = process.env.SERVERHOST || `http://localhost:${PORT}`;
  const avatarURL = `${HOST}` + "/avatars/" + resultName;

  const avatarDir = "public" + "/avatars/" + resultName;

  Jimp.read(tmpUpload, (err, avatar) => {
    if (err) throw err;
    avatar.resize(250, 250).quality(60).write(avatarDir);
  });
  if (req.user) {
    const id = req.user._id;
    await Users.findOneAndUpdate({ _id: id }, { avatarURL });
    await fs.unlink(tmpUpload);
  }

  res.json({ avatarURL, status: "success" });
};

module.exports = {
  userSignupController,
  userLoginController,
  userLogoutController,
  getUserContactsController,
  userSubscriptionController,
  uploadAvatarController,
  userVerifyController,
  userEmailVerifyController,
};
