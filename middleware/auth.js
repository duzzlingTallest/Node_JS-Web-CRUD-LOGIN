const jwt = require('jsonwebtoken');
const User = require('../model/users');

const auth = async (req, resp, next) => {
  try {
    const mytoken = req.cookies.jwt;
    const verifyToken = await jwt.verify(mytoken, process.env.S_KEY);

    if (verifyToken) {
      const userdata = await User.findOne({ _id: verifyToken._id });

      const match = userdata.Tokens.find((ele) => {
        return ele.token == mytoken;
      });

      if (match == undefined) {
        resp.render('login', { err: 'Please login first !!!!' });
        
      }
      else{

          //   console.log("test"+match);
          req.user = userdata;
          req.token = mytoken;
          next();
        }
    } else {
      resp.render('login', { err: 'Please login first !!!!' });
    }
  } catch (error) {
    resp.render('login', { err: 'Please login first !!!!' });
  }
};

module.exports = auth;

