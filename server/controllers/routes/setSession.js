const dbQuery = require('../../db.js');

module.exports = (req, res)=> {
  const username = req.params.username;
  const password = req.params.password;
  const _q = `Insert into sessions (login,password) values ('${username.replace(/\'|\"|\<\>/g, "")}',
    														'${password.replace(/\'|\"|\<\>/g, "")}')`
    dbQuery(req, res, _q, function(err, result) {
        res.json({
            "ok": "gergreg"
        })
    })
  dbQuery(query)
    .then(() => res.end("Success"))
    .catch(err =>res.status(500).end(err.toString()));
}