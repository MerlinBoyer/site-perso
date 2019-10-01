
class UserSession {
    constructor() {
        this.name = '',
        this.isLogged = false,
        this.pseudo = '',
        this.isVerified = false
    }
}


module.exports = function (req, res, next) {

    // init user on first time
    if (typeof req.session.user == 'undefined') {
        req.session.user = new UserSession()
    }

    // send user obj to client
    res.locals.user = req.session.user

    next()

}