const db = require('./database');
const Sequelize = require('sequelize');
const todos = require('../express-models/todos');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  due: Sequelize.DATE,
});

const Owner = db.define('Owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

Task.clearCompleted = async function() {
  await Task.destroy({
    where: {
      complete: true,
    }
  })
}

Task.completeAll = async function() {
  await Task.update({
    complete:  true,
  },
  {
    where: {
      complete: false,
    }
  })
}

Task.prototype.getTimeRemaining = function() {
  if (this.dataValues.due === undefined) {
    return Infinity;
  }

  const now = new Date();
  return this.dataValues.due - now;
}

Task.prototype.isOverdue = function() {
  const now = new Date();
  return this.dataValues.complete === false && now > this.due ?
  true : false
}

Task.prototype.assignOwner = async function(owner) {
  this.setOwner(owner.dataValues.id);
  await this.save();

  const promise = new Promise((resolve, reject) => {
    if (this.dataValues.OwnerId) {
      resolve(this);
    }
    else {
      reject('Failed');
    }
  })
  return promise;
}

Owner.getOwnersAndTasks = async function() {
  const owners = await Owner.findAll({
    include: Task,
  })
  return owners
}

Owner.prototype.getIncompleteTasks = async function() {

  // return await this.getTasks({
  //   where: {
  //     complete: false,
  //   },
  // });

  const incompleteTasks = await Owner.findOne({
    include: {
      model: Task,
        where: {
          OwnerId: this.id,
          complete: false,
        }
    }
    })

  return incompleteTasks.Tasks
}

Owner.beforeDestroy(owner => {
  if (owner.name === 'Grace Hopper') {
    throw new Error('rejected');
  }
})

Task.belongsTo(Owner);
Owner.hasMany(Task);


//---------^^^---------  your code above  ---------^^^----------

module.exports = {
  Task,
  Owner,
};
