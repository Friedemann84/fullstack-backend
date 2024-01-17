
//authification middleware

const auth = (req, res, next) => {
  /* 
  Es wird versucht mit der session-id vom session-cookie die userId aus der mongoDB session collection zu lesen
  */
  const userId = req.session.userId;
  if (!userId) {
    const error = new Error('Ungültige Session, du bist nicht eingeloggt');
    error.status = 401;
    return next(error);
  }
  req.userId = userId; // nicht zwingend nötig
  next();
};

export default auth;