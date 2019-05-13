var express = require('express');
var apiv1 = express.Router();


apiv1.use('/users', require('../users'))

module.exports = apiv1;