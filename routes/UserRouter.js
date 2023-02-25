const UserController = require("../controllers/UserController");

const router = require("express").Router();

router.post("register", UserController.register);

router.post("checkApi", UserController.checkApi);

router.post("login", UserController.login);

router.post("changePassword", UserController.changePassword);

router.post("changeApi", UserController.changeApi);

router.post("update", UserController.update);

router.post("deleteUser", UserController.deleteUser);

module.exports = router;
