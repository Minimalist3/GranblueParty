export function buildWhereClause (data) {
  let query = '';
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
  return {query, values};
}

export function sendError (response, status, message) {
  response.status(status).send({
    "error": {
      "code": status.toString(),
      "message": message,
    }
  });
}