const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../utils/middleware");
const campgroundController = require('../controllers/campgrounds');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground))

router.get("/new", isLoggedIn, campgroundController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm))

module.exports = router;