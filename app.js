const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/signup.html`)
});

// Require mailchimp module
const mailchimp = require('@mailchimp/mailchimp_marketing');

// Set your API key, server, List Id
mailchimp.setConfig({
  apiKey: 'd8daa9f3e08f1c188a026314f640ba6e-us20',
  server: 'us20',
});
const listId = '6ef7ec4a54';

// Declare function that add a contact to an audience
async function run(data) {
    const response = await mailchimp.lists.addListMember(listId, {
        email_address: data.email,
        status: 'subscribed',
        merge_fields: {
            FNAME: data.firstName,
            LNAME: data.lastName
        }
    });

    // Show success message
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
    run(subscribingUser);
});