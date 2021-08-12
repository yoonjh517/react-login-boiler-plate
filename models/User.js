const mongoose = require("mongoose");
// bcrypt setting
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// before save user informtaion
// don't use arrow function here, follow the instruction...
userSchema.pre("save", function (next) {
  var user = this;
  // only if user changes password
  if (user.isModified("password")) {
    // encrypt user password by using bcrypt
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      // hash: encrypted password
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
