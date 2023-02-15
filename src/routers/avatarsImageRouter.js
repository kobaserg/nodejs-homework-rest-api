const express = require("express");

const router = express.Router();

const { asyncWrapper } = require("../helpers/apiHelpers");

const { avatarReadController } = require("../controllers/avatarImage");

router.get("/:avatar", asyncWrapper(avatarReadController));

module.exports = { avatarsImageRouter: router };
