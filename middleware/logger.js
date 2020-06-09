// custom middle ware mimmicing morgan
module.exports = (format) => {
    return (req, res, next) => {
        switch (format) {
            case "short":
                console.log(`[${Date.now()}] ${req.method} ${req.url}`)
                break
            case "long":
                default:
                    const time = new Date().toISOString()
                    console.log(`[${time}] ${req.ip} ${req.method} ${req.url}`)
        }       

        // USED TO MOVE ON WHEN MIDDLEWARE IS DONE
        next()
    }
}