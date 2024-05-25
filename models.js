const User = require('./models/user');
const Post = require('./models/post');
const Review = require('./models/review');

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

Post.hasMany(Review);
Review.belongsTo(Post);



module.exports = { User, Post, Review};