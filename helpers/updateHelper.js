function updateHelper(event, tableName) {
  const requestBody = JSON.parse(event.body);
  const template_name = requestBody.template_name;
  const template_message = requestBody.template_message;

  const params = {
    TableName: tableName,
    Key: {
      "user_id": event.pathParameters.user_id,
      "template_id": event.pathParameters.template_id
    },
    UpdateExpression: "set template_name = :tn, template_message = :tm",
    ExpressionAttributeValues: {
      ":tn": template_name,
      ":tm": template_message,
    },
    ReturnValues: "UPDATED_NEW"
  };
  return params;
}

module.exports = updateHelper;
