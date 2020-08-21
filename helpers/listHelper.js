function listHelper(event, tableName) {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "#ui = :user_id",
    ExpressionAttributeNames: {
      "#ui": "user_id"
    },
    ExpressionAttributeValues: {
      ":user_id": event.pathParameters.user_id
    }
  };
  return params;
}

module.exports = listHelper;
