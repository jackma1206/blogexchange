//use local db or mlab db

if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://jackma:loljay123@ds155461.mlab.com:55461/commblog-prod'}
}else{
  module.exports = {mongoURI: 'mongodb://localhost:27017/commblog-dev'}
}
