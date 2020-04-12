const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

//maintenance switch
app.use((req, res, next) => {

    //Set 'true' in 'maintenance' variable to shut down the service for maintenance.
    const maintenance = false
    if (maintenance) {
        res.status(503).send('The site is currently under maintenance, check back soon!')
    }
    else {
        next()
    }
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})