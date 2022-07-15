import config from '../config';
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
  config.mailinjet.public_key, config.mailinjet.private_key
);

export function buildWhereClause(data, query = '') {
  let values = [];
  let counter = 1;
  for (const key in data) {
    if (data[key] != undefined) {
      if (query.length == 0) {
        query = ' WHERE ';
      }
      else {
        query += ' AND ';
      }

      query += key + '=$' + counter;
      values.push(data[key]);
      counter++;
    }
  }
  return [query, values];
}

export function sendSuccess(response, data = null) {
  response.status(200).send({
    data: data
  });
}

export function sendError(response, status, message) {
  response.status(status).send({
    "error": {
      "code": status.toString(),
      "message": message,
    }
  });
}

export function sendResetPasswordEmail(username, email, token) {
  const url = "https://www.granblue.party/reset?t=" + encodeURIComponent(token) + "&e=" + encodeURIComponent(email);

  return mailjet
    .post("send", {'version': 'v3.1'/*, 'perform_api_call': false*/})
    .request({
      "Messages":[{
        "From": {
          "Email": "noreply@granblue.party",
          "Name": "Granblue Party"
        },
        "To": [{
          "Email": email
        }],
        "Subject": "Reset your password",
        "TextPart": "Hello " + username + ". Please follow this link to reset your password: " + url,
        "HTMLPart": "<h3>Hello " + encodeURI(username) + "!</h3><br /><a href=\"" + url +
          "\">Click here to reset your password</a>.<br /><br />Alternatively you may paste this link into your browser: " + url
      }]
    });
}