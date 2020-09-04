/* eslint-disable new-cap */
/* eslint-disable consistent-return */
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, required: true },
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const saltRounds = 10;

UserSchema.pre('save', function savePassword(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, saltRounds, (error, hashedPassword) => {
    if (error) {
      return next(error);
    } else {
      user.password = hashedPassword;
      return next();
    }
  });
});

//  note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password)
    .then((comparisonResult) => {
      return callback(null, comparisonResult);
    })
    .catch((error) => {
      return callback(error);
    });
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
