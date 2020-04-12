const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

//Create new Task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//List all tasks of authenticated user with option of sorting and paginating
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        if (typeof (req.query.sortBy) == 'string') {
            const [fieldNameToSortBy, order] = req.query.sortBy.split(":")
            sort[fieldNameToSortBy] = order === 'desc' ? -1 : 1
        } else {
            req.query.sortBy.forEach(element => {
                const [fieldNameToSortBy, order] = element.split(":")
                sort[fieldNameToSortBy] = order === 'desc' ? -1 : 1
            })
        }
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match, //Instead of "match: match" (ES6)
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort //Instead of "sort: sort" (ES6)
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

//Find task of authenticated user by task id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        return res.status(500).send()
    }
})

//Update Task of authenticated user by task id
router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(202).send(task)
    } catch (e) {
        return res.status(400).send()
    }
})

//Delete task of authenticated user by task id
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.status(200).send(task)
    } catch (e) {
        return res.status(500).send()
    }
})

module.exports = router