const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
    getProfile,
    updateProfile,
    searchUsers,
    addFriend,
    removeFriend,
    getFriends
} = require("../controllers/userController");

router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);
router.get("/search", auth, searchUsers);
router.put("/add-friend/:id", auth, addFriend);
router.put("/remove-friend/:id", auth, removeFriend);
router.get("/friends", auth, getFriends);

module.exports = router;
