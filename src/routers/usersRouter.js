const express = require("express");
const router = express.Router();

// const {
//   contactsValidation,
//   favoriteValidation,
// } = require("../middlewares/validationMiddleware");

const { asyncWrapper } = require("../helpers/apiHelpers");
const {
  userSignupController,
  userLoginController,
  userLogoutController,
  getUserContactsController,
  userSubscriptionController,
} = require("../controllers/usersController");

const { userTokenMiddleware } = require("../middlewares/userMiddleware");

const {
  userValidation,
  userSubsciptoinValidation,
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

  userSubsciptoinValidation,
  asyncWrapper(userSubscriptionController)
);

module.exports = { usersRouter: router };
