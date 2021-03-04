var express = require('express');
const discordConstants = require('../discordConstants.js');



var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Optional messageId query string  
  var data = {channelName : discordConstants.channelName,
              messageId : req.query.messageId, 
              languageList: discordConstants.languageList, 
              textareaMaxLength : (discordConstants.messageMaxLength - 20)};
  res.render('index', data);
});



module.exports = router;
