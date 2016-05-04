var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
	username: String,
	password: String,
	email: String
});

// export a mongoose model that uses 'Account' as the collection name and Account as the Schema
module.exports = mongoose.model('Account', Account);