const express=require('express');
const cookieparser=require('cookie-parser');
const port=9999;
const app=express();
const db=require('./config/mongoose');
// / used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const PassportGoogle=require('./config/passport-google-oauth-2-stagry');
const MongoStore=require('connect-mongo')(session);
const Flash=require('connect-flash');
const custommware=require('./config/middleware');
const expresslatout=require('express-ejs-layouts');

app.use(express.urlencoded());
app.use(cookieparser());
app.use(express.static('./assets'));
app.use(expresslatout);
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.set('view engine','ejs');
app.set('views','./views');
app.use(session({
    name:'user authentication',
    secret:"userautentication",
    saveUninitialized:true,
    resave:false,
    cookie:
    {
        secure:false,
        maxAge:(1000*60*100)
    },
    store:new MongoStore(
    {
        mongooseConnection:db,
        autoRemove:'disabled'
    },
    function(err)
    {
        console.log(err||'connect-mongodb setup ok ');
    })
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(Flash());
app.use(custommware.setflash); 
app.use('/',require('./router'));
app.listen(port,function(err)
{
    if(err)
    {
        console.log("some problem and issue");
        return;
    }
    console.log("server prper run ",port);
    return;
});
