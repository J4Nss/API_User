var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = mongoose.model('Customer', new Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  age: { 
    type: Number, 
    min: 13, 
    max: 99 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
  },
  salt: String,
  passwordhash: String,
  admin: { 
    type: Boolean, 
    default: false 
  },
  created: { 
    type: Date, 
    default: Date.now 
  }
}));