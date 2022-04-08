const User = require('../models/user.model')
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');


function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if(!sessionData) {
    sessionData = {
      email : '',
      confirmeEmail : '',
      password : '',
fullname: '',
street: '',
postal: '',
city: '',
    };
  }
  
res.render('customer/auth/signup', { inputData: sessionData })
}

async function signup(req, res, next) {
const enteredData = {
 email:  req.body.email,
 confirmEmail: req.body['confirm-email'],
 password:  req.body.password,
 fullname: req.body.fullname,
  street: req.body.street,
postal:   req.body.postal,
  city : req.body.city
}

if (!validation.userDetailsAreValid(
  req.body.email,
  req.body.password,
  req.body.fullname,
  req.body.street,
  req.body.postal,
  req.body.city
  )|| !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(req, 
      {
errorMessage: 'Please Check Your Input. Password must be aleast 6 character slong, postal code must be 5 character',
...enteredData
    }, function() {

res.redirect('/signup');
    });
  return;
} 
const user = new User(
  req.body.email,
  req.body.password,
  req.body.fullname,
  req.body.street,
  req.body.postal,
  req.body.city
);



try {
  const existsAlready = await user.existsAlready();

if(existsAlready) {
  sessionFlash.flashDataToSession(req, 
    {
    errorMessage: 'Already exists: Please Visit to the Login Page.',
    ...enteredData,
  }, function (){
    res.redirect('/signup');

  })
  return;
}

await user.signup();
} catch(error) {
next(error);
return;
}
res.redirect('/login');
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if(!sessionData) {
    sessionData = {
      email : '',
      
      password : '',
    };
  }
  res.render('customer/auth/login', {inputData: sessionData})
  }

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

const sessionErrorData = {
   errorMessage: 'Invalid Credentials: Check your Login Id or password', email: user.email, password: user.password
}

  if(!existingUser) {
    sessionFlash.flashDataToSession(req,sessionErrorData ,
    function() {
      res.redirect('/login');
    }
    );
    return;
  }
  const passIsCorrect = await user.hasMatchingPassword(existingUser.password);
  if (!passIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData ,
      function() {
        res.redirect('/login');
      }
      );
    return;
  }
authUtil.createUserSession(req, existingUser, function(){
  res.redirect('/');
})
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req, res);
  res.redirect('/login');
}

module.exports = {
getSignup: getSignup,
getLogin: getLogin,
signup: signup,
login: login,
logout: logout
};