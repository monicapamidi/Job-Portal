var mongoose = require('mongoose');
module.exports = mongoose.model('user_jobs', {
    job: {type: mongoose.Schema.Types.ObjectId, ref: 'jobs'},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    saved: {type: Boolean},
    applied: {type: Boolean}
});