var express = require('express');
const discordConstants = require('../discordConstants.js');

var router = express.Router()

/* GET redirect to Discord Channel, possibly with a messageId */
router.get('/', function(req, res, next) {
    var url = discordConstants.atcsQaChannelURL;
  
    if (req.query.messageId)
      url += `/${req.query.messageId}`;
    res.redirect(url);
  });

module.exports = router;
