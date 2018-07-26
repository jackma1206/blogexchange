const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PostSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date:{
    type: String,
    // default: Date.now
  },
  user:{
    type: String,
    required: true
  },
  img:{
    type: String,
  }
});

mongoose.model('posts', PostSchema);
