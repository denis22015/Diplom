

const dbQuery = require('../../db.js');

module.exports = ( req, username, password, done)=> {
    const _q = `select * from sessions where lower(login)= lower('${username.replace(/\'|\"|\<\>/g, "")}')  `;

    dbQuery(req, null, _q, (err, result) =>{
        if(err){

            console.log(err.toString());
        }
        req.session=req.session||{};

        req.session.user=req.session.user||[];
        if (!result[0]) {
            console.log('wrong login and pass');
            return done(null, null);
        }

        const pass = result[0].password;
        if(pass==password){                       
           req.logIn(result[0],()=>{
                //req.session.user.push( result[0])
                done(null, result[0]);
           })
        }
    }) 
}