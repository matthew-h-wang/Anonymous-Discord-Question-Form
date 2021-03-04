var express = require('express');
const fetch = require('node-fetch');
const formParser = require('multer')();
const rateLimit = require("express-rate-limit");
const discordConstants = require('../discordConstants.js');

var router = express.Router();

//rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS) * 1000, //
  max: parseInt(process.env.RATE_LIMIT_MAX) // limit each IP to max requests per windowMs
});
router.use(limiter);

router.use

//handlers for hitting the Discord Webhook
function formToMessageContent(formData){
  //Compile content to be posted
  var content = formData.Question
  if (formData.Code)
    content += "\n```" + `${formData.Language}\n${formData.Code}\n` + "```"               
  if (formData.Error)
    content += "\nError Message:\n```" + `\n${formData.Error}\n` + "```"
  if (content.length > discordConstants.messageMaxLength)
    throw Error(`Your message (${content.length} chars) is too long (${discordConstants.messageMaxLength} max)`);

  return content;
}

/*
  Returns a Promise with JSON result of fetch
*/
function fetchAndLog(request_url, request_params){
    return fetch(request_url, request_params)
      .then(function (response) {
        console.log(`FETCH: ${request_params.method} ${request_url} ${response.status}`);
        return response;
      });
}

router.post("/", formParser.none(), function(req, res, next) {
    const formData = req.body;
    try {
      var content = formToMessageContent(formData)
    } catch (error) {
      res.status(422).send(error.message);
      return;
    }
    const request_url = discordConstants.webhookUrl + "?" + new URLSearchParams({wait: 'true'})

    const request_params = {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({content: content, username : formData.Subject}) 
      }
      fetchAndLog(request_url, request_params)
      .then(response => {
        res.status(response.status);
        return (response.ok) ? response.json() : response.text();
      })
      .then(data => res.send(data))
      .catch(err => next(err));
});


router.patch("/", formParser.none(), function(req, res, next) {

  const messageId = req.query.messageId;
  const formData = req.body;
  try {
    var content = formToMessageContent(formData)
  } catch (error) {
    res.status(422).send(error.message);
    return;
  }

  const request_url = discordConstants.webhookUrl + `/messages/${messageId}` + "?" + new URLSearchParams({wait: 'true'})

  const request_params = {
    method: 'PATCH',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({content: content}) 
    }
    fetchAndLog(request_url, request_params)
    .then(response => {
      res.status(response.status);
      return (response.ok) ? response.json() : response.text();
    })
    .then(data => res.send(data))
    .catch(err => next(err));
  });

router.delete("/", function(req, res, next) {
    const messageId = req.query.messageId;
    const request_url = discordConstants.webhookUrl + `/messages/${messageId}` + "?" + new URLSearchParams({wait: 'true'})

    const request_params = {
      method: 'DELETE'
    }
    fetchAndLog(request_url, request_params)
    .then(response => res.status(response.status).send(response.text()))
    .catch(err => next(err));
  });

module.exports = router;
