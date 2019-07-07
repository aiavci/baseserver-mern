import mongoose from 'mongoose';

import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
});

userSchema.statics.findByLogin = async function(loginEmail: string) {
  const user = await this.findOne({
    email: loginEmail,
  });

  return user;
};

userSchema.methods.comparePassword = function(candidatePassword: any, cb: any) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) { return cb(err); }
      cb(null, isMatch);
  });
};

userSchema.methods.updateUser = function(userProps: any, cb: any) {
  const {name, email, password} = userProps;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err2, hash) => {
      if (err) { return cb(err); }

      this.name = name;
      this.email = email;
      this.password = hash;

      this.save(cb);
    });
  });
};

userSchema.pre('remove', function(next) {
  this.model('Blog').deleteMany({ user: this._id }, next);
});

userSchema.statics.createUser = (userProps: any, callback: any) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(userProps.password, salt, (err2, hash) => {
      const newUser = new User({
        name: userProps.name,
        email: userProps.email,
        password: hash,
      })

      newUser.save(callback);
    });
  });
}

export const User = mongoose.model('User', userSchema);
