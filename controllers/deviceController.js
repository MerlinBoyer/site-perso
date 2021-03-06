
const path = require('path')
var DB = require(path.join(__dirname, '..', 'db/db'))
db = new DB()

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var msg = {
  to: 'techmyeli@gmail.com',
  from: 'merlin.byr@gmail.com',
  subject: 'ALERTE GENERAAAAL',
  text: 'alarm ?',
  html: 'bonjour, une alarme a été détectée a ' + new Date().toLocaleTimeString() + ' (GTM+0). cordialement'
};





exports.sendMail = (req, res, next) => {
    console.log('send email')
    if(req.body.profile == "my-eli") {
        msg.html += req.body
    }
    sgMail.send(msg)
        .catch((err) => {
            console.log(err.response.body)
        });
    next()
}


exports.sendTestMail = (req, res, next) => {
    console.log('send email')
    sgMail.send(msg)
        .catch((err) => {
            console.log('sgmail error : ', err.response.body)
        });
    next()
}


exports.testAlarm = (req, res, next) => {
    let deviceId = req.body.deviceId
    console.log('device id : ', deviceId)

    db.findUserByDeviceId(deviceId, (userResult) => {
        console.log('user found : ', userResult)
        if (! userResult) {
            req.flashError('no-corresponding-user', 'Aucun utilsateur correspondant à ce code')
            res.redirect('/user/alerts')
        } else {
            db.findFriendByUser(userResult, (friendResult) => {
                console.log('friend found : ', friendResult)
                if (! friendResult) {
                    req.flashError('no-corresponding-friend', 'Aucun email cible attaché à votre compte')
                    res.redirect('/user/alerts')
                } else {
                    var msg = {
                        to: friendResult.email,
                        from: 'no-reply@merlinboyer.fr',
                        subject: 'Message',
                        text: 'alarm ?',
                        html: 'bonjour, une alarme a été détectée a ' + new Date().toLocaleTimeString() + '(GTM+0). cordialement'
                    };
        
                    sgMail.send(msg)
                        .catch((err) => {
                            console.log('sgmail Error : ', err.response.body)
                        });

                    console.log('alarm email send to : ', msg.to)
                    req.flashSuccess('test-alarm', 'message envoyé !')
                    res.redirect('/user/alerts')
                }
            })
        }
    })
}

/*
echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
echo "sendgrid.env" >> .gitignore
source ./sendgrid.env
*/