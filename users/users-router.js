const express = require("express")
const users = require("./users-model")

const router = express.Router()

router.get("/users", (req, res, next) => {
	// these options are supported by the `users.find` method,
	// so we get them from the query string and pass them through.
	const options = {
		// query string names are CASE SENSITIVE,
		// so req.query.sortBy is NOT the same as req.query.sortby
		sortBy: req.query.sortBy,
		limit: req.query.limit,
	}

	users.find(options)
		.then((users) => {
			res.status(200).json(users)
		})
		.catch(next)
})

router.get("/users/:id", checkUserID(), (req, res) => {
	res.status(200).json(req.user)
})

router.post("/users", checkUserData(), (req, res, next) => {

	users.add(req.body)
		.then((user) => {
			res.status(201).json(user)
		})
		.catch(next)
})

router.put("/users/:id", checkUserID(), checkUserData(), (req, res, next) => {
	// REPLACED WITH CHECKUSERDATA()
	// if (!req.body.name || !req.body.email) {
	// 	return res.status(400).json({
	// 		message: "Missing user name or email",
	// 	})
	// }

	users.update(req.params.id, req.body)
		.then(() => {
			res.status(200).json(req.user)
		})
		.catch(next)
})

router.delete("/users/:id", checkUserID(), (req, res, next) => {
	users.remove(req.params.id)
		.then(() => {
			res.status(200).json({
				message: "The user has been nuked",
				name: `${req.user.name}`
			})
		})
		.catch(next)
})

// Since posts in this case is a sub-resource of the user resource,
// include it as a sub-route. If you list all of a users posts, you
// don't want to see posts from another user.
router.get("/users/:id/posts", checkUserID(), (req, res, next) => {
	users.findUserPosts(req.params.id)
		.then((posts) => {
			res.status(200).json(posts)
		})
		.catch(next)
})

// Since we're now dealing with two IDs, a user ID and a post ID,
// we have to switch up the URL parameter names.
// id === user ID and postId === post ID
router.get("/users/:id/posts/:postId", checkUserID(), (req, res, next) => {
	users.findUserPostById(req.params.id, req.params.postId)
		.then((post) => {
			if (post) {
				res.json(post)
			} else {
				res.status(404).json({
					message: "Post was not found",
				})
			}
		})
		.catch(next)
})

router.post("/users/:id/posts", checkUserID(), (req, res, next) => {
	if (!req.body.text) {
		// Make sure you have a return statement, otherwise the
		// function will continue running and you'll see ERR_HTTP_HEADERS_SENT
		return res.status(400).json({
			message: "Need a value for text",
		})
	}

	users.addUserPost(req.params.id, req.body)
		.then((post) => {
			res.status(201).json(post)
		})
		.catch(next)
})

// USER MIDDLEWARE

function checkUserID() {
	return (req, res, next) => {
		users.findById(req.params.id)
			.then((user) => {
				if (user) {
					// attaches user to req object
					req.user = user
					next()
				} else {
					res.status(404).json({
						message: "user not found"
					})
				}
			})
			.catch(next)
	}
}

function checkUserData() {
	return (req, res, next) => {
		if (!req.body.name || !req.body.email) {
			return res.status(400).json({
				message: "Missing user name or email",
			})
		}

		next()
	}
}

module.exports = router