const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
  uname: {
    type: String,
  },
  email: {
    type: String,
  },
  pass: {
    type: String,
  },
  joindate: {
    type: Date,
    default: Date.now(),
  },
  img: {
    type: String,
  },
});

userSchema.pre('save', async function () {
  try {
    this.pass = await bcrypt.hash(this.pass, 10);
  } catch (error) {}
});

userSchema.methods.generateToken = async function () {
  try {
    const token = await jwt.sign({_id:this._id},process.env.S_KEY); //jwt.sign(PASS ANY TWO PARAMETERS)<=methode
    return token
  } catch (error) {}
};

module.exports = new mongoose.model('User', userSchema);
