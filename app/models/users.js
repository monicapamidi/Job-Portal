var mongoose = require('mongoose');
module.exports = mongoose.model('users', {
    username: {type: String, default: '', unique: true},
    password: {type: String, select: false},
    email: {type: String, default: ''},
    phone: {type: String, default: ''},
    location: {type: String, default: ''},
    type: {type: Number, default: 0}
});