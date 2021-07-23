"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // username+psw
const session = require("express-session");
const userDao = require("./user-dao");
const dao = require("./task-dao"); // module for accessing the DB
const dayjs = require("dayjs");
const { check, validationResult } = require("express-validator"); // validation middleware

// init express
const app = new express();
const PORT = 3001;

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());

// Activate the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

/*** Set up Passport ***/
passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user) return done(null, false, { error: "Incorrect email and/or password." });

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user); // req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(400).json({ error: "Not authorized" });
};

// enable sessions in Express
app.use(
  session({
    // set up here express-session
    secret:
      "una frase segreta da non condividere con nessuno e da nessuna parte, usata per firmare il cookie Session ID",
    resave: false,
    saveUninitialized: false,
  })
);

// init Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());

/*** Tasks APIs ***/

// GET /api/tasks
app.get("/api/tasks", (req, res) => {

  if (Object.keys(req.query).length === 0) {
    dao
      .listTasks(req.user.id)
      .then((tasks) => res.json(tasks))
      .catch(() => res.status(500).end());
  } else
    switch (req.query.filter) {
      case "all":
        dao
          .listTasks(req.user.id)
          .then((tasks) => res.json(tasks))
          .catch(() => res.status(500).end());
        break;
      case "important":
        dao
          .listImportantTasks(req.user.id)
          .then((tasks) => res.json(tasks))
          .catch(() => res.status(500).end());
        break;
      case "private":
        dao
          .listPrivateTasks(req.user.id)
          .then((tasks) => res.json(tasks))
          .catch(() => res.status(500).end());
        break;

      case "deadline":
        dao
          .listTasksWithDeadline(req.user.id, req.query.date)
          .then((tasks) => {
            res.json(tasks);
          })
          .catch(() => res.status(500).end());
        break;

      case "next7days":
        dao
          .listNext7DaysTasks(req.user.id)
          .then((tasks) => {
            res.json(tasks);
          })
          .catch(() => res.status(500).end());
        break;

      default:
        res.status(500).end();
    }
});

// GET /api/tasks/<code>
app.get("/api/tasks/:id", (req, res) => {
  dao
    .listTaskWithID(req.user.id, req.params.id)
    .then((task) => {
      if (task.error) res.status(404).json(task);
      else res.json(task);
    })
    .catch(() => res.status(500).end());
});

// POST /api/tasks
app.post(
  "/api/tasks",
  [
    check("important").isInt({ min: 0, max: 1 }),
    check("private").isInt({ min: 0, max: 1 }),
    check("completed").isInt({ min: 0, max: 1 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const task = {
      description: req.body.description,
      important: req.body.important,
      private: req.body.private,
      deadline: req.body.deadline,
      completed: false,
      user: req.user.id,
    };

    dao
      .createTask(task)
      .then(() => {
        res.status(201).end();
      })
      .catch((id) => res.status(503).json({ error: `Database error during the creation of task.` }));
  }
);

// PUT /api/tasks/<id>
app.put(
  "/api/tasks/:id",
  [
    check("important").isInt({ min: 0, max: 1 }),
    check("private").isInt({ min: 0, max: 1 }),
    check("completed").isInt({ min: 0, max: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array().toString() });
    const taskToUpdate = req.body;
    if (req.params.id == taskToUpdate.id) {
      try {
        await dao.updateTask(req.user.id, taskToUpdate);
        res.status(200).end();
      } catch (err) {
        res.status(503).json({ error: `Database error during the update of task.` });
      }
    } else return res.status(503).json({ error: `Wrong code in the request body.` });
  }
);

// PUT /api/tasks?completeTaskID=<taskID>
app.put("/api/tasks", [check("isCompleted").isInt({ min: 0, max: 1 })], async (req, res) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array().toString() });
  try {
    await dao.setCompletedTask(req.user.id, req.query.completeTaskID, req.body.isCompleted);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the update of task.` });
  }
});

// DELETE /api/tasks/<id>
app.delete("/api/tasks/:id", (req, res) => {
  dao
    .deleteTask(req.user.id,req.params.id)
    .then(() => res.status(204).end())
    .catch(() => res.status(503).json({ error: `Database error during the deletion of task${req.params.id}.` }));
});

/*** User APIs ***/
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) res.json(req.user);
  else res.status(401).json({ error: "Not authenticated" });
});

// POST /sessions
// login
app.post("/api/sessions", [check("username").isEmail()], function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: "Invalid email" });
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current
// logout
app.delete("/api/sessions/current", (req, res) => {
  req.logout();
  res.end();
});
