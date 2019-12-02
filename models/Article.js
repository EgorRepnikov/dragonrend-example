const { Schema, model } = require('mongoose')

const schema = new Schema({
  body: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('articles', schema)