"use strict";
/* Data Access Object (DAO) module for accessing tasks */

const sqlite = require("sqlite3");
const dayjs = require("dayjs");

// open the database
const db = new sqlite.Database("tasks.db", (err) => {
  if (err) throw err;
});

// get all tasks
exports.listTasks = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE user=? ";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const task = rows.map((t) => ({
        id: t.id,
        description: t.description,
        important: t.important,
        priv: t.private,
        deadline: t.deadline,
        completed: t.completed,
        user: t.user,
      }));
      resolve(task);
    });
  });
};

// get all important tasks
exports.listImportantTasks = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE important==1 AND user=?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const task = rows.map((t) => ({
        id: t.id,
        description: t.description,
        important: t.important,
        priv: t.private,
        deadline: t.deadline,
        completed: t.completed,
        user: t.user,
      }));
      resolve(task);
    });
  });
};

// get all private tasks
exports.listPrivateTasks = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE private==1 AND user=?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const task = rows.map((t) => ({
        id: t.id,
        description: t.description,
        important: t.important,
        priv: t.private,
        deadline: t.deadline,
        completed: t.completed,
        user: t.user,
      }));
      resolve(task);
    });
  });
};

// get today tasks
exports.listTasksWithDeadline = (id,deadline) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE date(deadline)= ? AND user=?";
    db.all(sql, [id,deadline], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      if (rows[0] == undefined) {
        resolve([]);
      } else {
        const task = rows.map((t) => ({
          id: t.id,
          description: t.description,
          important: t.important,
          priv: t.private,
          deadline: t.deadline,
          completed: t.completed,
          user: t.user,
        }));
        resolve(task);
      }
    });
  });
};

// get next seven days tasks
exports.listNext7DaysTasks = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE date(deadline)>=? and date(deadline)<? AND user=?";
    db.all(
      sql,
      [dayjs().format("YYYY-MM-DD").toString(), dayjs().add(7, "day").format("YYYY-MM-DD").toString(), id],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
      
        const task = rows.map((t) => ({
          id: t.id,
          description: t.description,
          important: t.important,
          priv: t.private,
          deadline: t.deadline,
          completed: t.completed,
          user: t.user,
        }));
        resolve(task);
      }
    );
  });
};

// get tasks before deadline
exports.listTasksBeforeDeadline = (id,deadline) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE deadline<? AND user=?";
    db.all(sql, [deadline.format(), id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const task = rows.map((t) => ({
        id: t.id,
        description: t.description,
        important: t.important,
        priv: t.private,
        deadline: t.deadline,
        completed: t.completed,
        user: t.user,
      }));
      resolve(task);
    });
  });
};

// get tasks after deadline
exports.listTasksAfterDeadline = (deadline, id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM tasks WHERE deadline>? AND user=?";
    db.all(sql, [deadline.format(), id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const task = rows.map((t) => ({
        id: t.id,
        description: t.description,
        important: t.important,
        priv: t.private,
        deadline: t.deadline,
        completed: t.completed,
        user: t.user,
      }));
      resolve(task);
    });
  });
};

// get tasks with a certain {id}
exports.listTaskWithID = (userID, taskID) => {
  return new Promise((resolve, reject) => {
  
    const sql = "SELECT * FROM tasks WHERE id=? AND user=?";
    db.all(sql, [taskID, userID], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row[0] == undefined) {
        resolve({ error: "TASK not found." });
      } else {
        const task = {
          id: row[0].id,
          description: row[0].description,
          important: row[0].important,
          priv: row[0].private,
          deadline: row[0].deadline,
          completed: row[0].completed,
          user: row[0].user,
        };
        resolve(task);
      }
    });
  });
};

// add a new task
exports.createTask = (task) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO tasks( description, important, private, deadline, completed, user) VALUES(?, ?, ?, ?, ?, ?)";
    db.run(
      sql,
      [task.description, task.important, task.private, task.deadline, task.completed, task.user],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      }
    );
  });
};

// update an existing task
exports.updateTask = (userID, task) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE tasks SET description=?, important=?, private=?, deadline=?, completed=? WHERE id =? AND user=?";
    db.run(
      sql,
      [task.description, task.important, task.private, task.deadline, task.completed, task.id, userID],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      }
    );
  });
};

// delete an existing task
exports.deleteTask = (userID, taskID) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM tasks WHERE id = ? AND user=?";
    db.run(sql, [taskID, userID], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
};

// marking existing task as completed/uncompleted
exports.setCompletedTask = (userID, taskID, isCompleted) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE tasks SET completed=? WHERE id = ? AND user=?";
    db.run(sql, [isCompleted, taskID, userID], (err) => {
      if (err) {
        reject(err);
        return;
      } else resolve(null);
    });
  });
};
