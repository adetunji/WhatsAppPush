const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const TEMPLATES_TABLE = process.env.TEMPLATES_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Helper Functions
const updateHelper = require('../helpers/updateHelper');
const deleteHelper = require('../helpers/deleteHelper');
const detailsHelper = require('../helpers/detailsHelper');
const listHelper = require('../helpers/listHelper');

app.use(bodyParser.json({strict: false}));

module.exports.homePage = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go WhatsApp Push! Your function executed successfully!',
    }),
  };

  callback(null, response);
};

// Handler for saving template to database
module.exports.createTemplates = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const user_id = requestBody.user_id;
  const template_name = requestBody.template_name;
  const template_message = requestBody.template_message;

  submitTemplate(templateInfo(user_id, template_name, template_message))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully created template`,
          res: res,
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to create template`
        })
      })
    });
};


const submitTemplate = template => {
  console.log('Submiting template');
  const templateInfo = {
    TableName: TEMPLATES_TABLE,
    Item: template
  };
  return dynamoDB.put(templateInfo).promise()
    .then(res => template)
};

const templateInfo = (user_id, template_name, template_message) => {
  return {
    user_id: user_id,
    template_id: uuidv4(),
    template_name: template_name,
    template_message: template_message
  }
};

// Handler for updating templates in the database
module.exports.updateTemplates = (event, context, callback) => {
  const params = updateHelper(event, TEMPLATES_TABLE);
  console.log("Updating the item...");
  dynamoDB.update(params, (err, data) => {
    if (err) {
      console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
  })
    .promise()
    .then(res => {
      callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Sucessfully updated template`,
        res: res
      })
    });
  })
    .catch(err => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to update template`
        })
      })
    });
};

// Handler for deleting templates in the database
module.exports.deleteTemplates = (event, context, callback) => {
  const params = deleteHelper(event, TEMPLATES_TABLE);
  dynamoDB.delete(params, (err, data) => {
    if (err) {
      console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
  }).promise()
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully deleted template`,
        })
      });
    })
    .catch(err => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to delete template`
        })
      })
    });
};

// Handler for retrieving individual message templates
module.exports.detailsTemplates = (event, context, callback) => {
  const params = detailsHelper(event, TEMPLATES_TABLE);
  dynamoDB.query(params, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2))
    } else {
      console.log("Query succeeded.", data);
    }
  }).promise()
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully retrieved template details`,
          res: res
        })
      });
    })
    .catch(err => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to retrieve template details`
        })
      })
    });
}

// Handler for listing all templates by user id
module.exports.listTemplates = (event, context, callback) => {
  const params = listHelper(event, TEMPLATES_TABLE);
  dynamoDB.query(params, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2))
    } else {
      console.log("Query succeeded.", data);
    }
  }).promise()
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully retrieved template details`,
          res: res
        })
      });
    })
    .catch(err => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to retrieve template details`
        })
      })
    });
}


