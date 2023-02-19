const express = require("express");
const router = express.Router();

const { asyncWrapper } = require("../helpers/apiHelpers");
const {
  userSignupController,
  userLoginController,
  userLogoutController,
  getUserContactsController,
  userSubscriptionController,
  uploadAvatarController,
  avatarImageController,
} = require("../controllers/usersController");

const { userTokenMiddleware } = require("../middlewares/authMiddleware");
const { uploadMiddleware } = require("../middlewares/uploadMiddleware");

const {
  userValidation,
  userSubsciptionValidation,
} = require("../middlewares/validationMiddleware");

router.post("/signup", userValidation, asyncWrapper(userSignupController));

router.post("/login", userValidation, asyncWrapper(userLoginController));

router.get(
  "/logout/:id",
  userTokenMiddleware,
  asyncWrapper(userLogoutController)
);

router.get(
  "/current",
  userTokenMiddleware,
  asyncWrapper(getUserContactsController)
);

router.patch(
  "/",
  userTokenMiddleware,
  userSubsciptionValidation,
  asyncWrapper(userSubscriptionController)
);

router.patch(
  "/avatars",
  userTokenMiddleware,
  uploadMiddleware.single("avatar"),
  asyncWrapper(uploadAvatarController)
);

module.exports = { usersRouter: router };
