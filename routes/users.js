const express = require('express');
const router = express.Router();
const todos = require('../models/express-models/todos');
module.exports = router;


router.get('/', async (req, res, next) => {
    try {
        const users = await todos.listPeople();
        res.send(users);
    }
    catch(err) {
        next(err);
    }
})


router.get('/:name/tasks', async(req, res, next) => {
    try {
        const filters = req.query
        if (filters.status) {
            const userTasks =  todos.list(req.params.name)
            let filteredTasks = userTasks.filter((task) => {
                console.log(filters.status)
                if (filters.status === 'complete' && task.complete === true) {
                    return task
                }else if(filters.status === 'active' && task.complete !== true) {
                    return task }
            })
            res.status(200)
            res.send(filteredTasks)
            return
        }


        const users = todos.listPeople()

        if (!users.includes(req.params.name)) {
            return res.status(404).send('Not Found')
        }
        else {
            const userTasks =  todos.list(req.params.name)
            res.send(userTasks);
        }
    }
    catch(err) {
        next(err);
    }
})


router.post('/:name/tasks', async (req, res, next) => {
    try {
        if (!req.body.content) {
            return res.status(400).send();
        }

        await todos.add(req.params.name, req.body);
        res.status(201)

        res.send(req.body);
    }
    catch(err) {
        next(err);
    }
})

router.put('/:name/tasks/:index', (req, res, next) => {
    res.send(todos.complete(req.params.name, req.params.index))
})

router.delete('/:name/tasks/:index', (req, res, next) => {
    res.status(204)
    res.send(todos.remove(req.params.name, req.params.index))
})