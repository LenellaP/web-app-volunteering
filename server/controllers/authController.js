const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//реєстрація
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Перевірка, чи вже існує такий email або username
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: 'Користувач з таким іменем або email вже існує' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Користувача зареєстровано' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};
// авторизація
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Невірні облікові дані' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Невірні облікові дані' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
  }
};
