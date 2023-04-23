import express from "express";
import {
  addToFavorites,
  getMyFavorites,
  getMyProfile,
  login,
  logOut,
  removeFavorite,
  signup,
} from "../controller/users.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);

router.post("/new", signup);


router.get("/me", isAuthenticated, getMyProfile);
router.get("/logout", isAuthenticated, logOut);

router.put("/favorites/:id", addToFavorites);

router.delete("/favorites/:id", removeFavorite);

router.get("/favorites", getMyFavorites);

export default router;