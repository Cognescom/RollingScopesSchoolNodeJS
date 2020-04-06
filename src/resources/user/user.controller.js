const HTTP_STATUS = require('http-status');
const User = require('./../../models/user.model');
const userService = require('./user.service');
const { sendJsonError } = require('./../../utils/response/response.utils');

const getUsersTreatment = async (req, res) => {
  try {
    const users = await userService.getAll();
    res.status(HTTP_STATUS.OK).send(users);
  } catch (err) {
    sendJsonError(
      res,
      { message: err.message },
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

const getUserTreatment = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userService.getById(userId);
    if (!user) {
      return sendJsonError(
        res,
        {
          message: `User don't exist by id: ${userId}`
        },
        HTTP_STATUS.NOT_FOUND
      );
    }
    res.status(HTTP_STATUS.OK).send(User.toResponse(user));
  } catch (err) {
    sendJsonError(
      res,
      { message: err.message },
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

const createUserTreatment = async (req, res) => {
  const keys = Object.keys(req.body);
  const requiredFields = ['name', 'login', 'password'];
  const isValidOperation = requiredFields.every(key => keys.includes(key));
  if (!isValidOperation) {
    return sendJsonError(res, {
      message: 'Wrong operation! Send: name, login, password'
    });
  }
  try {
    const user = await userService.create(req.body);
    res.status(HTTP_STATUS.OK).send(User.toResponse(user));
  } catch (err) {
    sendJsonError(
      res,
      { message: err.message },
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

const updateUserTreatment = async (req, res) => {
  const userId = req.params.userId;
  const keys = Object.keys(req.body);
  const allowedUpdates = ['id', 'name', 'login', 'password'];
  const isValidOperation = keys.every(key => allowedUpdates.includes(key));
  if (!isValidOperation) {
    return sendJsonError(res, {
      message: 'Wrong operation! Allowed update fields: name, login, password'
    });
  }
  try {
    const user = await userService.update(userId, req.body);
    if (!user) {
      return sendJsonError(
        res,
        { message: `User don't exist by id: ${userId}` },
        HTTP_STATUS.NOT_FOUND
      );
    }
    res.status(HTTP_STATUS.OK).send(User.toResponse(user));
  } catch (err) {
    sendJsonError(
      res,
      { message: err.message },
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteUserTreatment = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userService.delete(userId);
    if (!user) {
      return sendJsonError(
        res,
        { message: `User don't exist by id: ${userId}` },
        HTTP_STATUS.NOT_FOUND
      );
    }
    res.status(HTTP_STATUS.NO_CONTENT).send('The user has been deleted');
  } catch (err) {
    sendJsonError(
      res,
      { message: err.message },
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  getUsersTreatment,
  getUserTreatment,
  createUserTreatment,
  updateUserTreatment,
  deleteUserTreatment
};
