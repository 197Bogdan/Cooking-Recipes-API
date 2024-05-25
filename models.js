const User = require('./models/user');
const Post = require('./models/post');
const Review = require('./models/review');
const UploadedImage = require('./models/uploadedImage');

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

Post.hasMany(Review);
Review.belongsTo(Post);

// User.hasMany(UploadedImage);
// UploadedImage.belongsTo(User);


module.exports = { User, Post, Review, UploadedImage };