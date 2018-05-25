var users = require('./models/users');
var jobs = require('./models/jobs');
var userJobs = require('./models/user_jobs');
var mongoose = require('mongoose');

function getJobsCreatedBy(user, res) {
    jobs.find({
        created_by: user._id
    }, function (err, jobs) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) res.send(err);
        res.json(jobs); // return all jobs in JSON format
    });
}

module.exports = function (app) {

    app.post('/api/login', function (req, res) {
        var data = req.body;
        users.findOne({
            username: data.username,
            password: data.password
        }, function (err, user) {
            if (err) res.send(err);
            console.log(user);
            res.json(user);
        })
    });

    app.post('/api/register', function (req, res) {
        var data = req.body;

        users.create({
            username: data.username,
            password: data.password,
            email: data.email,
            phone: data.phone,
            location: data.location,
            type: data.type
        }, function (err, user) {
            if (err) res.send(err);
            res.json(user);
        });
    });

    app.post('/api/create/job', function (req, res) {
        var user = req.body.user;
        var job = req.body.job;

        jobs.create({
            title: job.title,
            description: job.description,
            location: job.location,
            keywords: job.keywords,
            created_by: user._id
        }, function (err, job) {
            if (err) res.send(err);
            res.json(job);
        });
    });

    app.get('/api/search/jobs', function (req, res) {
        var title = typeof req.query.title !== 'undefined' ? req.query.title : '';
        var location = typeof req.query.location !== 'undefined' ? req.query.location : '';
        var keywords = typeof req.query.keywords !== 'undefined' ? req.query.keywords : '';
        var userId = req.query.user;

        jobs.find({
            title: {$regex: title, $options: "i"},
            location: {$regex: location, $options: "i"},
            keywords: {$regex: keywords, $options: "i"}
        }).exec(function (err, jobs) {
            if (err) console.log(err);
            var jobIds = [];
            var foundJobs = [];
            jobs.forEach(function (job) {
                foundJobs[job._id] = JSON.parse(JSON.stringify(job));
                jobIds.push(mongoose.Types.ObjectId(job._id));
            });

            userJobs.find({
                user: userId,
                job: {$in: jobIds}
            }, function (err, userJobs) {
                if (err) res.send(err);

                userJobs.forEach(function (userJob) {
                    if (foundJobs[userJob.job] !== 'undefined') {
                        foundJobs[userJob.job].saved = userJob.saved;
                        foundJobs[userJob.job].applied = userJob.applied;
                    }
                });

                var result = [];
                for (var key in foundJobs) {
                    result.push(foundJobs[key]);
                }
                res.json(result)
            });
        });
    });

    app.get('/api/jobs/saved', function (req, res) {
        var userId = req.query.user;
        userJobs.find({
            user: userId,
            saved: true
        }).populate('job').exec(function (err, jobs) {
            if (err) {
                console.log(err);
                res.send(err);
            }

            var savedjobs = [];
            jobs.forEach(function (job) {
                var savedJob = JSON.parse(JSON.stringify(job.job));
                savedJob.saved = job.saved;
                savedJob.applied = job.applied;
                savedjobs.push(savedJob);
            });
            res.json(savedjobs); // return all jobs in JSON format
        })
    });

    app.get('/api/jobs/applied', function (req, res) {
        var userId = req.query.user;
        userJobs.find({
            user: userId,
            applied: true
        }).populate('job').exec(function (err, jobs) {
            if (err) {
                console.log(err);
                res.send(err);
            }

            var savedjobs = [];
            jobs.forEach(function (job) {
                var savedJob = JSON.parse(JSON.stringify(job.job));
                savedJob.saved = job.saved;
                savedJob.applied = job.applied;
                savedjobs.push(savedJob);
            });
            res.json(savedjobs); // return all jobs in JSON format
        })
    });

    app.post('/api/jobs/save', function (req, res) {
        var user = req.body.user;
        var job = req.body.job;

        var query = {
            user: user._id,
            job: job._id
        };

        var newData = {
            user: user._id,
            job: job._id,
            saved: true
        };


        userJobs.findOneAndUpdate(query, newData, {upsert: true, new: true}).populate('job').exec(function (err, job) {
            if (err) return res.send(500, {error: err});
            var savedJob = JSON.parse(JSON.stringify(job.job));
            savedJob.saved = job.saved;
            savedJob.applied = job.applied;
            return res.json(savedJob);
        });
    });

    app.post('/api/jobs/apply', function (req, res) {
        var user = req.body.user;
        var job = req.body.job;

        var query = {
            user: user._id,
            job: job._id
        };

        var newData = {
            user: user._id,
            job: job._id,
            applied: true
        };

        userJobs.findOneAndUpdate(query, newData, {upsert: true, new: true}).populate('job').exec(function (err, job) {
            if (err) return res.send(500, {error: err});
            var savedJob = JSON.parse(JSON.stringify(job.job));
            savedJob.saved = job.saved;
            savedJob.applied = job.applied;
            return res.json(savedJob);
        });
    });

    app.get('/api/jobs/posted', function (req, res) {
        var userId = req.query.user;
        jobs.find({
            created_by: userId
        }, function (err, jobs) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            res.json(jobs); // return all jobs in JSON format
        })
    });
};