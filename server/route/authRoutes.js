const express = require('express');
const router  = express.Router();
const {
  registerUser, loginUser, logoutUser, getMe,
  getAllUsers, updateUser, deleteUser,
} = require('../controller/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login',    loginUser);
router.post('/logout',   logoutUser);
router.get('/me',        protect, getMe);

// ── Admin user management ──
router.get('/users',        protect, adminOnly, getAllUsers);
router.put('/users/:id',    protect, adminOnly, updateUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;