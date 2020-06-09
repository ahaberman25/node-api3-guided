const express = require("express")
const morgan = require("morgan")
const logger = require("./middleware/logger")
const noInsomnia = require("./middleware/no-insomnia")
const welcomeRouter = require("./welcome/welcome-router")
const usersRouter = require("./users/users-router")

const server = express()
const port = 4000

server.use(express.json())
// server.use(morgan("combined"))

// server.use(noInsomnia())

// EXTRACTED LOGGER // MORGAN COPY
server.use(logger("long"))



server.use(welcomeRouter)
server.use(usersRouter)

// error middleware 4 params
server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "These are not the droids you are looking for :eyes:"
	})
})

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
