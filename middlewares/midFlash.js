module.exports = function (req, res, next) {

    if ( req.session.flash ) {
        res.locals.flash = req.session.flash
        req.session.flash = undefined
    }


    req.flashError = function (type, content) {
        if ( req.session.flash === undefined) {
            req.session.flash = {}
        }
        if ( req.session.flash.errors === undefined ) {
            req.session.flash.errors = {}
        }
        req.session.flash.errors[type] = content
    }

    req.flashSuccess = function (type, content) {
        if ( req.session.flash === undefined) {
            req.session.flash = {}
        }
        if ( req.session.flash.success === undefined ) {
            req.session.flash.success = {}
        }
        req.session.flash.success[type] = content
    }
    
    next()

}