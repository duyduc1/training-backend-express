const express = require("express");
const authController = require("../controllers/auth.controller");
const passport = require("passport");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgotpass", authController.forgorPassword);
router.post("/resetpass", authController.resetPassword)

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    authController.googleCallback
);


module.exports = router;
