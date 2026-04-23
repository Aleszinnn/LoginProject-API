const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/google', authController.googleLogin);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/admin-dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: "Bem-vindo ao painel de controle, Admin!" });
});

module.exports = router;