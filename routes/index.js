var express = require('express');

const languageList = {
  "~~General~~": "",
  "Python":"py",
  "Java":"java",
  "C":"c",
  "C#":"csharp",
  "HTML":"html",
  "CSS":"css",
  "Javascript":"js",
  "Scheme":"scheme"
}

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Optional messageId query string  
  var data = { languageList: languageList, messageId : req.query.messageId};
  res.render('index', data);
});



module.exports = router;
