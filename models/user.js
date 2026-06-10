const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createUserToken } = require("../services/auth");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "/images/avatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  const salt = randomBytes(16).toString("hex");
  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashPassword;
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  //static method to match password during signin
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const salt = user.salt;
  const hashPassword = user.password;

  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (userProvidedHash !== hashPassword) throw new Error("Incorrect password");
  const token = createUserToken(user);
  return token;
});

module.exports = model("User", userSchema);