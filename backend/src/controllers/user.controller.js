const UserModel = require("../models/user.model");

exports.getUsers = (req, res) => {
  try {
    const users = UserModel.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = (req, res) => {
  try {
    const user = UserModel.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
