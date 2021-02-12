const mongoose = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    required: true,
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  favoRecipe: Array,
  role: {
    enum: ['user', 'admin']
  }
});



const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
