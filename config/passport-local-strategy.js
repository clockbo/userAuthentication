const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');
// autentication using passport
passport.use(new LocalStrategy(
    {
       usernameField:'email',
       passReqToCallback:true
    },
    function(req,email,password,done)
    {
        // find a user and extablish the identity
        User.findOne({email:email},function(err,user)
        {
            if(err)
            {
             req.flash('error','error in finding user in passport');
            // console.log('error in finding user in passport');
                return done(err);
            }
            if(!user)
            {
                req.flash('error','user is not find please sign up');
                // console.log('user is not find please sign up');
                return done(null,false);
            }
            if(user.password!=password)
            {
                req.flash('error',"password is not match please try again");
                // console.log("password is not match please try again");
                return done(null,false);
            }
            console.log(user);
            return done(null,user);
        });

    }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done)
{
    done(null,user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done)
{
    User.findById(id,function(err,user)
    {
        if(err)
        {
            console.log("error in finding user passport");
            return;
        }
        return done(null,user);
    })
});


// check if the user is authenticated
passport.checkAuthenticated=function(req,res,next)
{
    // if the user is signed in then pass on the request to the next function (controller)
    if(req.isAuthenticated())
    {
        return next();
    }
    // if the user is not signed in
    return res.redirect('back');
}
passport.setAuthenticatedUser=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        // req user contains the current signed in user from the session cookie and we are just  sending this to the locals for the views
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport;