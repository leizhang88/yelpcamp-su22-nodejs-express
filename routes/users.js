const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const userController = require('../controllers/users');

router.get("/register", userController.renderRegisterForm)

router.post("/register", catchAsync(userController.registerUser))

router.get("/login", userController.renderLoginForm)

router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser)

router.get("/logout", userController.logoutUser)

module.exports = router; 