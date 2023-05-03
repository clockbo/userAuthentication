const mongose=require('mongoose');
mongose.connect(`mongodb+srv://sagarktech:E7eIA2p9erzn4Xyt@cluster0.p05iu6p.mongodb.net/?retryWrites=true&w=majority`);
const db=mongose.connection;
db.on('error',console.error.bind(console,"errror conected to db"));
db.once('open',function()
{
    console.log("coneted to the database ");
});
module.exports=db;
