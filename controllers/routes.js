var express = require("express");
var passport = require('passport');
var router = express.Router();
var path = require('path')

var connection = require('../config/connection')

// Import the model (job.js) to use its database functions.
var job = require("../models/job.js");
//=========================
router.get("/", function(req, res,next) {
  res.sendFile(path.join(__dirname, '../public/assets/', 'loginScreen.html'));
});

router.post('/',
passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/'
})
);


router.post('/', function(req,res,next) {
  pg.connect(connectionString, function(err, client){

    var query = client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [request.body.username, request.body.password]);

    query.on('error', function(err){
      console.log(err);
    })

    query.on('end', function(){
      response.sendStatus(200);
      client.end();
    })

  })
});

router.get('/', function(req, res, next) {
  res.send(req.isAuthenticated());
});

router.get('/', function(req, res, next) {
  res.send(req.isAuthenticated());
 });
//////////////////////////=========
router.get("/jobs", function(req, res) {
  res.sendFile(path.join(__dirname, '../public/assets/', 'jobsScreen.html'));
});

router.get("/edit", function(req, res) {
  res.sendFile(path.join(__dirname, '../public/assets/', 'addScreen.html'));
});

router.get("/edit/:id", function(req, res) {
  res.sendFile(path.join(__dirname, '../public/assets/', 'addScreen.html'));
});

router.get("/event", function(req, res) {
  res.sendFile(path.join(__dirname, '../public/assets/', 'eventScreen.html'));
});

router.get("/event/:id", function(req, res) {
  res.sendFile(path.join(__dirname, '../public/assets/', 'eventScreen.html'));
});


/****************
 * API ROUTES 
 ***************/

// router.get('/api/job')
router.get("/api/jobs", function(req, res) {
  job.selectAll(function(data) {
    res.json(data);
  })
})

router.post("/api/job", function(req, res) {
  job.insertOne([
    "company", "location", "title", "description",
    "company_link", "posting_link", "primary_contact_name",
    "primary_contact_position", "primary_contact_email",
    "primary_contact_phone", "salary", "notes", "stage"
  ], [
    req.body.company, req.body.location, req.body.title,
    req.body.description, req.body.company_link, req.body.posting_link,
    req.body.primary_contact_name, req.body.primary_contact_position,
    req.body.primary_contact_email, req.body.primary_contact_phone,
    req.body.salary, req.body.notes, req.body.stage
  ], function(result) {
    // Send back the ID of the new quote
    res.json({ id: result.insertId });
  });
});

// Create router.put function for update one
router.put("/api/job/:id", function(req, res) {
  var condition = "id = " + req.params.id;

  console.log("condition", condition);

  job.updateOne({ 
    company: req.body.company, location: req.body.location, title: req.body.title,
    description: req.body.description, company_link: req.body.company_link, posting_link: req.body.posting_link,
    primary_contact_name: req.body.primary_contact_name, primary_contact_position: req.body.primary_contact_position,
    primary_contact_email: req.body.primary_contact_email, primary_contact_phone: req.body.primary_contact_phone,
    salary: req.body.salary, notes: req.body.notes, stage: req.body.stage  
  }, condition, function(result) {
    // if (result.changedRows == 0) {
    //   // If no rows were changed, then the ID must not exist, so 404
    //   return res.status(404).end();
    // } else {
    res.json({id: req.body.id})
      // res.status(200).end();
    // }
  });
});

router.get("/api/job/:id", function(req, res) {
  job.findOne(req.params.id, function(jobData) {
      res.json(jobData);
    });
});

router.post("/api/event", function(req, res) {
  job.insertEvent([
    "job_id", "event_time", "location", "name",
    "notes", "contact_name", "contact_position",
    "contact_email", "contact_phone"
  ], [
    req.body.job_id, req.body.event_time, req.body.location,
    req.body.name, req.body.notes, req.body.contact_name,
    req.body.contact_position, req.body.contact_email,
    req.body.contact_phone
  ], function(result) {
    // Send back the ID of the new quote
    res.json({ id: result.insertId });
  });
});

router.get(`/api/event/:id`, function(req, res) {
  job.findEvents(req.params.id, function(jobData) {
      res.json(jobData);
    });
});

router.put("/api/job/:id/events", function(req, res) {
  router.get(`/api/event/${req.params.id}`).then(function(res) {
    for (i = 0; i < res.length; i++) {
      events.push(res[i]);
  }
  if (events.length > 0) {
     renderEvents();
  } 
  console.log(events);
});
  // let dude = getEvents(req.params.id);
  // job.findEvents(req.params.id, function(jobData) {
  //     res.json(jobData);
  //   });
});

router.delete("/api/events/:id", function(req, res) {
  var condition = "id = " + req.params.id;

  job.delete(condition, function(result) {
    if (result.affectedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

// router.get('/grabAllJobsFromDB', function(req,res) {
//   connection.query('SELECT * FROM JOBS').then(function(allJobsWeFound){
//     console.log('these are all the jobs we found!!!!', allJobsWeFound);
//   })
// })

module.exports = router;
