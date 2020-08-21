function detailsHelper(event, tableName) {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "#ui = :user_id AND #ti = :template_id",
    ExpressionAttributeNames: {
      "#ui": "user_id",
      "#ti": "template_id"
    },
    ExpressionAttributeValues: {
      ":user_id": event.pathParameters.user_id,
      ":template_id": event.pathParameters.template_id
    }
  };
  return params;
}

module.exports = detailsHelper;
