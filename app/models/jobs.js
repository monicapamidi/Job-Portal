var mongoose = require('mongoose');
module.exports = mongoose.model('jobs', {
    title: {type: String, default: ''},
    description: {type: String, default: ''},
    location: {type: String, default: ''},
    keywords: {type: String, default: ''},
    created_by: {type: mongoose.Schema.Types.ObjectId,  ref: 'users'}
});