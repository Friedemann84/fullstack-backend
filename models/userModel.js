import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  benutzername: String,
  passwort: String,
  email: String
});

const User = mongoose.model('users', userSchema);

export default User;