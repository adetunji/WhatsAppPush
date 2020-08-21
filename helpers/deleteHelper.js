function deleteHelper(event, tableName) {
  const params = {
    TableName: tableName,
    Key: {
      "user_id": event.pathParameters.user_id,
      "template_id": event.pathParameters.template_id
    }
  };
  return params;
}

module.exports = deleteHelper;
