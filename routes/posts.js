const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//load user model
require('../models/Posts');
const Post = mongoose.model('posts');
require('../models/Comments');
const Comment = mongoose.model('comments');
require('../models/User');
const User = mongoose.model('users');

router.get('/index', (req, res) => {
  Post.find({})
    .sort({
      date: 'desc'
    }).then(post => {
      res.render('posts/index', {
        name: req.user.name,
        posts: post
      });
    });

});

router.get('/add', (req, res) => {
  res.render('posts/add', {
    name: req.user.name
  });
});

//adding and saving new post
router.post('/', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    error.push({
      text: "Please add a title."
    });
  }

  if (!req.body.description) {
    error.push({
      text: "Please add a description."
    });
  }

  if (!req.body.body) {
    error.push({
      text: "Please add a body."
    });
  }

  if (!req.body.image) {
    error.push({
      text: "Please add a image."
    });
  }

  if (errors.length > 0) {
    res.render('posts/add', {
      title: req.body.title,
      description: req.body.description,
      body: req.body.body,
      image: req.body.image
    });
  } else {
    let dates = new Date().toDateString();

    console.log(dates);
    const newEntry = {
      title: req.body.title,
      description: req.body.description,
      body: req.body.body,
      user: req.user.id,
      name: req.user.name,
      img: req.body.image,
      date: dates
    }
    new Post(newEntry)
      .save()
      .then(post => {
        res.redirect('posts/index');
      });
  }

});

//see all posts from logged in user

router.get("/:username/myposts", (req, res) => {
  Post.find({
      user: req.user.id
    }).sort({
      date: 'desc'
    })
    .then(userPost => {
      res.render('users/myposts', {
        posts: userPost,
        name: req.user.name
      });
    });
});

//edit form process
router.put('/:id', (req, res) => {
  Post.findOne({
      _id: req.params.id
    })
    .then(post => {
      post.title = req.body.title,
        post.description = req.body.description,
        post.body = req.body.body,
        post.img = req.body.image
      post.save()
        .then(post => {
          res.redirect('/posts/index')
        });
    });
});

//see more of post

router.get('/:id', (req, res) => {
  Post.findOne({
      _id: req.params.id
    })
    .then(post => {
      Post.find({
        user: post.user
      }).then(userPost => {
        User.findOne({
          _id: post.user
        }).then(author => {
          Comment.find({
            postID: req.params.id
          }).sort({
            date: "desc"
          }).then(allComments => {
            res.render('posts/onepost', {
              posts: post,
              userPosts: userPost,
              name: req.user.name,
              id: req.params.id,
              comments: allComments,
              author: author
            });
          });
        });
      });
    });
});

//edit post

router.get('/edit/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  }).then(post => {
    res.render('posts/edit', {
      posts: post
    });
  });

});

//delete posts
router.delete('/:id', (req, res) => {
  Post.remove({
      _id: req.params.id
    })
    .then(() => {
      res.redirect('users/myposts')
    });
});

//save comment
router.post('/:id', (req, res) => {
  User.findOne({
    _id: req.user.id
  }).then(user => {
    let dates = new Date().toDateString();
    const newComment = {
      user: req.user.id,
      body: req.body.commentBox,
      postID: req.params.id,
      name: user.name,
      date: dates,
      userPic: user.pic
    }
    new Comment(newComment)
      .save()
      .then(comment => {
        res.redirect('/posts/' + req.params.id);
      });
  });


});


module.exports = router;
