const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const RecentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  discountPrice: {
    type: Number,
    required: true
  }, 
  price: {
    type: Number,
    required: true
  },

});

module.exports = mongoose.model('Recent', RecentSchema);