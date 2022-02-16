var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 4, required: true },
    age: { type: Number, required: true },
    phone: { type: Number },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hased) => {
      if (err) return next(err);
      this.password = hased;
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

module.exports = mongoose.model("User", userSchema);
