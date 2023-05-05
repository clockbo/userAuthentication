const mongose=require('mongoose');
mongose.connect(`mongodb+srv://sagarktech:SHSujwVG46jzipWR@cluster0.oriamxa.mongodb.net/?retryWrites=true&w=majority`);
const db=mongose.connection;
db.on('error',console.error.bind(console,"errror conected to db"));
db.once('open',function()
{
    console.log("coneted to the database ");
});
module.exports=db;
