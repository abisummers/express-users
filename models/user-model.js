const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    //doc structure and rules
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^.+@.+\..+$/
    },
    encryptedPassword: { type: String },
    role: {
      type: String,
      enum: ["normal", "admin"],
      required: true,
      default: "normal"
    }
  },
  {
    //additional settings
    timestamps: true
  }
);

//define isAdmin property (a property that is a method)
//Cant be an arrow function because it uses 'this'
//we want the 'this' to change because we need to use isAdmin
userSchema.virtual("isAdmin").get(function() {
  return this.role === "admin";
});

const User = mongoose.model("User", userSchema);
module.exports = User;
