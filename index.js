const connectToMongo=require("./database")
const express = require('express')
// var flash = require('connect-flash');
var cors = require('cors')
// var AuthController = require('./routes/admin');

connectToMongo();

const app = express();
// app.use(flash)
app.use(cors());
const port = process.env.PORT||5000
app.get('/', (req, res) => {
  res.send('orsoot backend')
})

app.use(express.json())


app.use('/user', require('./routes/user.js'))
app.use('/admin', require('./routes/admin.js'))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})