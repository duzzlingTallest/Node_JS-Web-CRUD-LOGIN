const router = require('express').Router();
const User = require('../model/users');
const multer = require('multer');
const fs = require('fs'); // for delete img into code folder in ./public/upload
const bcrypt = require('bcryptjs');
const auth = require("../middleware/auth");



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  },
});

var upload = multer({
  storage: storage,
});

router.get('/', (req, res) => {
  res.redirect('login'); // redirect find the "/registration" <== name request..
});

router.get('/registration', (req, res) => {
  res.render('registration'); // render find "registration.hbs" <== file
});

router.get('/login', (req, res) => {
  res.render('login'); // render find "login.hbs" <== file
});

router.post('/do_register', upload.single('img'), async (req, res) => {
  try {
    // Schema Objects
    const user = new User({
      uname: req.body.uname,
      email: req.body.email,
      pass: req.body.pass,
      img: req.file.filename,
    });
    const data = await user.save();
    console.log(data);
    res.render('registration', { msg: 'Registration Successfully Done....' });
  } catch (error) {
    console.log(error);
  }
});

router.get('/view',auth, async (req, res) => {

  const user = req.user
  try {
    const data = await User.find({_id:user._id});
   
    res.render('view', { udata: data });
  } catch (error) {
    console.log(error);
  }
});

router.get('/delete', async (req, res) => {
  const did = req.query.did;
  try {
    const data = await User.findByIdAndDelete(did);
    fs.unlinkSync('./public/upload/' + data.img); // for delete img into code folder in ./public/upload
    res.redirect('view');
  } catch (error) {
    console.log(error);
  }
});

router.get('/edit', async (req, res) => {
  const eid = req.query.eid; // it can be get the id from the database

  try {
    const data = await User.findOne({ _id: eid });
    res.render('update', { udata: data });
  } catch (error) {
    console.log(error);
  }
});

router.post('/do_update', upload.single('img'), async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(req.body._id, {
      uname: req.body.uname,
      email: req.body.email,
      pass: req.body.pass,
      img: req.file.filename,
    });
    fs.unlinkSync('./public/upload/' + data.img);
    //   res.render("update",{msg : "Update Successfully Done...."})
    res.redirect('view');
  } catch (error) {
    console.log(error);
  }
});

router.post('/do_login', async (req, res) => {
  try {
    const userdata = await User.findOne({ email: req.body.email });

    const isValid = await bcrypt.compare(req.body.pass, userdata.pass);

    if (isValid) {
      const token = await userdata.generateToken();


      res.cookie('jwt', token);
      res.redirect('view');
    } else {
      res.render('login', { err: 'Valid Credentials !!!' });
    }
  } catch (err) {
    console.log(error);
    res.render('login', { err: 'Invalid Credentials !!!' });
  }
});

router.get("/logout",auth,async(req,res)=>{
  try {
    
    res.clearCookie("jwt")
    res.render("login")

  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
