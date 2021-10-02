const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, required: true },
});

module.exports = model("User", userSchema);
