const app = require('./app')

app.listen(process.env.PORT, () => {
    console.log(`Users service running on port ${process.env.PORT}`)
})
