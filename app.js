// Require modules
const express = require('express');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const dotenv = require('dotenv');
dotenv.config();

// Start up an instance of app
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// Defines the port number 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// GET route
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/signup.html`)
});

const api = process.env.API_KEY_MAILCHIMP;

// Set your API key, server, List Id
mailchimp.setConfig({
  apiKey: `d8daa9f3e08f1c188a026314f640ba6e-us20`,
  server: 'us20',
});
const listId = '6ef7ec4a54';

// Declare 'run' function that add a contact to an audience
async function run(data) {
    const response = await mailchimp.lists.addListMember(listId, {
        email_address: data.email,
        status: 'subscribed',
        merge_fields: {
            FNAME: data.firstName,
            LNAME: data.lastName
        }
    });

    // Show successful message
    console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
};

// POST route
app.post('/', (req, res) => {
    // Declare empty array to store our data from post request
    const subscribingUser = {
        firstName: req.body.fName,
        lastName: req.body.lName,
        email: req.body.email
    };
    // Check our data
    console.log(subscribingUser);

    // Execute function
    run(subscribingUser)
    .then(() => {
        if (res.statusCode === 200) {
            console.log("Success!");
            res.sendFile(`${__dirname}/public/success.html`);
        } else {
            console.log("Unsuccessful.");
            res.sendFile(`${__dirname}/public/failure.html`);
        }
    });
});