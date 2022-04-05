const LocalStrategy = require('passport-local').Strategy //Local strategy
const bcrypt = require('bcrypt') //Encryping with bcrypt package

//Initializing the passport, Email and Id
function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    //No user Conditioning
    if (user == null) {
      //Message Box to Inform about the null val
      return done(null, false, { message: 'No user with that email' })
    }
    try {
      //Checking the values of Register values with Login
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } 
      else {
        //Message Box to Inform about the null val
        return done(null, false, { message: 'Password incorrect' })
      }
    } 
    catch (e) {
      return done(e)
    }
  }
  //Using Local Strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  //Storing inside the session
  passport.deserializeUser((id, done) => {
  return done(null, getUserById(id))
  })
}

module.exports = initialize