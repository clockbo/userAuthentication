require('dotenv').config();
const mongose=require('mongoose');
mongose.connect(process.env.MONGI_URI);
const db=mongose.connection;
db.on('error',console.error.bind(console,"errror conected to db"));
db.once('open',function()
{
    console.log("coneted to the database ");
});
module.exports=db;
