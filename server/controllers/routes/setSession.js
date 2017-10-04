const dbQuery = require('../../db.js');

module.exports = (req, res)=> {
    var username = req.params.username;
    var password = req.params.password;
    var _q = `Insert into sessions (login,password) values ('${username.replace(/\'|\"|\<\>/g, "")}',
    														'${password.replace(/\'|\"|\<\>/g, "")}')`
    dbQuery(req, res, _q, function(err, result) {
        res.json({
            "ok": "gergreg"
        })
    })
}