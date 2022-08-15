let tasks = {}; //

/*
  tasks (defined above) will be a place to store tasks by person;
  example:
  {
    person1: [{task object 1}, {task object 2}, etc.],
    person2: [{task object 1}, {task object 2}, etc.],
    etc.
  }
*/

module.exports = {
  reset: function () {
    tasks = {}; // (this function is completed for you.)
  },

  // ==== COMPLETE THE FOLLOWING (SEE `model.js` TEST SPEC) =====
  listPeople: function () {
    let res = [];
    for (let person in tasks) {
      if (tasks[person].length > 0) {
        res.push(person)
      }
    }
    return res;
    // returns an array of all people for whom tasks exist
  },

  add: function (name, task) {
    tasks[name] ? tasks[name].push(task) : tasks[name] = [task];

    if (!task.complete) {
      tasks[name][tasks[name].length - 1].complete = false;
    }
    // saves a task for a given person
  },

  list: function (name) {
    return tasks[name]
    // returns tasks for specified person
  },

  complete: function (name, idx) {
    tasks[name][idx].complete = true;
  },

  remove: function (name, idx) {
    tasks[name].splice(idx, 1)
    // removes a tasks
  },
};
