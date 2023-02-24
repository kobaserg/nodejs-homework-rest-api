const { Users } = require("../db/usersModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");
const {
  NotAuthorizedError,
  ConflictError,
  UserVerifyError,
  UserEmailVerifyError,
} = require("../helpers/errors");
const gravatar = require("gravatar");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const userSignup = async (email, password) => {
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();
  const user = new Users({
    email,
    password,
    avatarURL,
    verificationToken,
  });

  if (await Users.findOne({ email })) {
    throw new ConflictError(`message: Email: '${email}' in use`);
  }

  await user.save();

  const msg = {
    to: email,
    from: "serhiy.koba.it@gmail.com",
    subject: "Thank you for registration!",

    text: `Please, confirm your email address POST http://localhost:8000/api/users/verify/${verificationToken}`,
    html: `Please, confirm your email address POST http://localhost:8000/api/users/verify/${verificationToken}`,
  };
  await sgMail
    .send(msg)
    .then(() => console.log("Email send successfully"))
    .catch(console.error());

  return user;
};

const userVerify = async (verificationToken) => {
  const user = await Users.findOne({ verificationToken });

  if (!user) {
    throw new UserVerifyError(`User not found`);
  }

  await Users.findOneAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
};

const userEmailVerify = async (email) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new UserVerifyError(`User not found`);
  }
  if (user.verify === true) {
    throw new UserEmailVerifyError("Verification has already been passed");
  }

  const msg = {
    to: email,
    from: "kobaserg@meta.ua",
    subject: "Thank you for registration!",

    text: `Please, confirm your email address POST http://localhost:8000/api/users/verify/${user.verificationToken}`,
    html: `Please, confirm your email address POST http://localhost:8000/api/users/verify/${user.verificationToken}`,
  };
  await sgMail
    .send(msg)
    .then(() => console.log("Email send successfully"))
    .catch(console.error());
};

const userLogin = async (email, password) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new NotAuthorizedError(`User with email: '${email}' not found`);
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw new NotAuthorizedError(`Wrong password: '${password}' `);
  }

  if (user.verify === false) {
    throw new UserVerifyError(`User's email not verifited`);
  }

  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      subscription: user.subscription,
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
  userVerify,
  userEmailVerify,
};
