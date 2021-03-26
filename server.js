const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

require('dotenv').config();

// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '906737124097-1grf87l6veq5dchmc1uf26djv8t6mlms.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const PORT = process.env.PORT || 5000;

let authenticated;

// Middleware
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cookieParser());
app.use('/assets', express.static('assets'));
app.use('/src', express.static('src'));

const IdealPostcodesApi = process.env.IDEALPOSTCODES_API_KEY;
const GoogleApi = process.env.GOOGLE_MAPS_API_KEY;

app.get('/', (req, res) => {
    res.render('index', {
        IdealPostcodesApi: IdealPostcodesApi,
        GoogleApi: GoogleApi
    });
});

app.get('/login', succesfullyAuthenticated, (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    let token = req.body.token;
    console.log(token);

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(payload);
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
      }
      verify()
      .then(() => {
          res.cookie('session-token', token);
          res.send('success');
      })
      .catch(console.error);
});

app.get('/dashboard', checkAuthenticated, (req, res) => {
    let user = req.user;
    res.set({
        'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
    })
    res.render('dashboard', {user});
})

app.get('/protectedroute', checkAuthenticated, (req, res) => {
    let user = req.user;
    res.set({
        'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
    })
    res.render('protectedroute', {user});
})

app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/login');
})

function checkAuthenticated(req, res, next) {
    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        });

        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    }

    verify()
      .then(() => {
          req.user = user;
          authenticated = true;
          next();
      })
      .catch((err) => {
        res.redirect('/login');
        authenticated = false;
      });
}

function succesfullyAuthenticated(req, res, next) {
    if(authenticated === true && req.path === '/login'){
        res.redirect('/dashboard');
        res.end();
    } else{
        next();
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});