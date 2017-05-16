const express = require('express');
const ensure  = require('connect-ensure-login');
const multer  = require('multer');
const path    = require('path');

const User    = require('../models/user.js');

const router  = express.Router();


router.get('/profile',
  //We need to be logged in to change/add  profile
ensure.ensureLoggedIn('/login'),

(req, res, next) => {
  res.render('/profile.ejs');
}
);

const myUploader = multer({
  dest: path.join(__dirname, '../public/uploads')
});

// form method post
router.post('/profile',
//we need to be logged in to add/chage profile pic
  ensure.ensureLoggedIn('/login'),

  //input type="file" name="userPhoto"

  myUploader.single('userPhoto'),

  (req, res, next) => {
    console.log('');
    console.log('req.file --------------');
    console.log('req.file');
    console.log(' ');

    const theUser = new User({
      name: req.body.userName,
      description: req.body.email,
      photoAddress: `/uploads/${req.file.filename}`,
      owner: req.user._id
    });

theUser.save((err)=> {
  if(err) {
    next(err);
    return;
  }
  req.flash('success', 'Your profile was saved successfully');

  res.redirect('/profile');
});
  }
);


router.get('/rooms', ensure.ensureLoggedIn(),
(req, res, next) => {
  Room.find(
    { owner: req.user._id },
    (err, roomsList) => {
      if (err) {
        next(err);
        return;
  }

      // if (roomsList.length > 0) {

      res.render('rooms/rooms-list-view.ejs', {
        rooms: roomsList,
        successMessage: req.flash('success')
      });
    }
  );
}
);

module.exports = router;
