var express = require('express');
const discordConstants = require('../discordConstants.js');



var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Optional messageId query string  
  var data = { languageList: discordConstants.languageList, 
              messageId : req.query.messageId, 
              textareaMaxLength : (discordConstants.messageMaxLength - 20)};
  res.render('index', data);
});



module.exports = router;
