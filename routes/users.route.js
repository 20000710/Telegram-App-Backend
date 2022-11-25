const express = require('express');

// controller here
const {
    getAllUsers,
    usersDetail,
    usersUpdate,
    usersUpdatePhoto
  } = require('../controllers/users.controllers');

// middleware
const jwtAuth = require('../middlewares/JWTAuth');
const validationResult = require('../middlewares/validation');
const upload = require('../middlewares/upload');

const router = express.Router();

router
  .get('/', getAllUsers) // to get all users
  .get('/:id', usersDetail) // to get users detail by id
  .put('/', jwtAuth, validationResult, usersUpdate) // to update information users
  .put('/upload/:id', jwtAuth, upload, usersUpdatePhoto) // to upload photo profile image

  module.exports = router;