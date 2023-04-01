// importing express
const express = require("express");
// importing https
const https = require("https");
// importing body-parser
const bodyParser = require("body-parser");
require("dotenv").config();

// Creating app using express
const app = express();

// Creating port
const port = 3000;

// using the bodyParser in urlEncoder mode
app.use(bodyParser.urlencoded({ extended: true }));

// get function for "/" route
app.get("/", (req, res) => {
  // sending the index.html file back as response
  res.sendFile(`${__dirname}/index.html`);
});

// post request function for "/" route
app.post("/", (req, res) => {
  // creating constants to get data entered by the user
  const email = req.body.email;
  const fName = req.body.firstName;
  const lName = req.body.lastName;

  // creating an object to send data via API
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  // converting the object to packed json
  const jsonData = JSON.stringify(data);

  //api url
  const url = "https://us17.api.mailchimp.com/3.0/lists/d47d16f599";

  // options object to make api call
  const options = {
    method: "POST",
    auth: `manobal:${process.env.API}`,
  };

  // making an api call
  const request = https.request(url, options, (response) => {
    // if the response is successful go to success page else go to failure page
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/Success.html`);
    } else {
      res.sendFile(`${__dirname}/Failure.html`);
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  // send the data from user to API
  request.write(jsonData);
  request.end();
});

// post request function for "/failure" route
app.post("/failure", (req, res) => {
  // using try again button to redirect to home page
  res.redirect("/");
});

// Listening to the port
app.listen(port, () => {
  // Console logging the server starting message
  console.log(`Server is online at port : ${port}`);
});
