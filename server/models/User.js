const mongoose = require("mongoose");
// bcrypt setting
const bcrypt = require("bcrypt");
const saltRounds = 10;
// jwt
const jwt = require("jsonwebtoken");

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

// comparing password function for login request
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // encrypt plain password to compare with the password data from database, cb: callback
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// generating token function for login request
userSchema.methods.generateToken = function (cb) {
  var user = this;
  // generate token by using jsonwebtoken
  // user._id + 'secretToken' = token
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

// authentication
userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  // varify token
  jwt.verify(token, "secretToken", function (err, decoded) {
    // find user by using user id
    // check if client token and database token is same
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
