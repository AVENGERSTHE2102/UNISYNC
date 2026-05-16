
module.exports = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
