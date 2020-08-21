const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const TEMPLATES_TABLE = process.env.TEMPLATES_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({strict: false}));

app.get('/', (req, res) => {
  res.send('Hey WhatsApp!')
});

app.post('/templates', (req, res) => {
  const {user_id, template_name, template_message} = req.body;
  if (typeof user_id !== 'string') {
    res.status(400).json({ error: '"User ID" must be a string' });
  }else if (typeof template_name !== 'string') {
    res.status(400).json({ error: '"Template Name" must be a string' });
  }else if (typeof template_message !== 'string') {
    res.status(400).json({ error: '"Template Message" must be a string' });
  }

  let uuid = uuidv4();
  const params = {
    TableName: TEMPLATES_TABLE,

    Item: {
      user_id: user_id,
      template_id: uuid,
      template_name: template_name,
      template_message: template_message
    },
  };

  dynamoDB.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create template' });
    }
    res.json({ user_id, template_name, template_message });
  });
});


// 'use strict';
//
// module.exports.hello = async event => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };
//
//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
module.exports.createTemplates = serverless(app);
