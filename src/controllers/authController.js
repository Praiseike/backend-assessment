const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");

const SECRET_KEY = process.env.JWT_SECRET;


class AuthController {


  static async login(req, res) {
    try {

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ error: true, message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: true, message: "Invalid credentials" });
      }

      const token = jwt.sign({ user_id: user.id }, SECRET_KEY, { expiresIn: "1h" });

      //geet rid of sensitive values like password
      delete user.dataValues.password;

      res.status(200).json({
        error: false,
        message: "Login success",
        data: { token, user }
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  };



  static async register(req, res) {
    try {
      
      const { email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({
          error: true,
          message: "User already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({ email, password: hashedPassword });
      // same here
      delete user.dataValues.password;
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

      res.status(201).json({
        error: false,
        message: "Register success",
        data: { token, user }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: true,
        message: "Error creating user",
      });
    }
  };
}


module.exports = AuthController;

