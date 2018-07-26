const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CommentSchema = new Schema({
  user:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  postID:{
    type: String,
    required: true
  },
  name:{
    type: String,
    required: true
  },
  date:{
    type: String,
  },
  userPic:{
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  }
});

mongoose.model('comments', CommentSchema);
