require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const { SESSION_SECRET, CONNECTION_STRING } = process.env;
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');

const PORT = 4000;

const app = express();

app.use(express.json());

massive(CONNECTION_STRING).then(database => {
    app.set('db', database)
    console.log('database is connected')
})

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60
        }
    })
)

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly,treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.listen(PORT, () => (`Listening on port ${PORT}`));