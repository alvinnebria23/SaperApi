const db = require("../models");
const UserService = require("../service/UserService");

const User = db.users;

const register = async (req, res) => {};

const checkApi = async (req, res) => {
  UserService.checkApi();
};

const login = async (req, res) => {};

const changePassword = async (req, res) => {};

const changeApi = async (req, res) => {};

const update = async (req, res) => {};

const deleteUser = async (req, res) => {};

module.exports = {
  register,
  checkApi,
  login,
  changePassword,
  changeApi,
  update,
  deleteUser,
};
