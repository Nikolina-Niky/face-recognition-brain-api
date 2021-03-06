const express = require('express');
const bodyParser  = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./Controllers/Register')
const signIn = require('./Controllers/SignIn')
const profile = require('./Controllers/Profile')
const image = require('./Controllers/Image')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 
const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

db.select('*').from('users').then( data => {
   console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('It is working!')
});

app.post('/signin',(req, res) => {signIn.handleSignIn(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});
app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleClarifaiApiCall(req, res)});
app.post('/register', (req, res) => {register.handleRegister(req,res, db, bcrypt)})

app.listen(process.env.PORT || 3000, ()=> {
	console.log(`app is running on port ${process.env.PORT}`);
});

/* 
/ -> root
/signIn-> POST = success/fail
/register -> POST = return user
/profile:userid -> GET = return user
/image -> PUT (user olready exist) -> return user

*/