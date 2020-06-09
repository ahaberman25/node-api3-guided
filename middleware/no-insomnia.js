module.exports = () => {
    return (req, res, next) => {
        // STRING THAT TELLS US WHAT SOFTWARE CLIENT IS USING
        const agent = req.headers["user-agent"]

        // regular expression to check if insomnia in the return
        if (/insomnia/i.test(agent)) {
            return res.status(418).json({
                message: "No Insomnia Allowed Here"
            })
        } 

        next()
    }
}