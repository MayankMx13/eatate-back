import express from "express";

import { deleteUSer, getUser, getUsers, profilePosts, savePost, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js"
const router = express.Router();

router.get("/", getUsers);
// router.get("/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/logout", verifyToken, deleteUSer);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);


export default router;


