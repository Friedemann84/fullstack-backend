import User from "../models/userModel.js";
import bcrypt from 'bcrypt';

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwort -__v')  
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const addUser = async (req, res, next) => {
  try {
    const {benutzername, passwort, email} = req.body;
    const hashedPW = await bcrypt.hash(passwort, 10);
    const user = await User.create({
      benutzername,
      passwort: hashedPW,
      email
    });
    res.status(201).send({benutzername, email, id: user._id});
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const {email, passwort} = req.body;
    const user = await User.findOne({email});
    if(!user) {
      const error = new Error('email ungültig');
      error.status = 401;
      throw error;
    }  
    const match = await bcrypt.compare(passwort, user.passwort);
    if (!match) {
      const error = new Error('Passwort ungültig');
      error.status = 401;
      throw error;
    }
    /* 
    - zu der session-id von diesem req werden Daten (userId) in mongoDB session-collection gespeichert 
    - bei res wird ein Cookie im Client angelegt mit der session-Id als Wert
    */
    req.session.userId = user._id;
    
    res.send({message: 'Du bist eingeloggt :)'})
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.status(204).end();
  });
};

const geheimnis = (req, res, next) => {
  res.send({message: 'Willkommen im Aktenschrank des Petagon: Welche Sauerei wollen sie aufdecken?'})
}

export {getUsers, addUser, login, logout, geheimnis}