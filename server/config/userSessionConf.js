module.exports = ()=>({
        secret: 'secret)',
        expires: new Date(Date.now() + 1000 * 60 * 6000),
        saveUninitialized: true,
        resave: true,
    collection: 'sessions',cookie : { secure : false, maxAge : (2*60 * 60 * 60 * 1000) 
   }
})