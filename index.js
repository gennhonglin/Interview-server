const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const validator = require('validator');

//This is the middleware
app.use(cors());
app.use(express.json());

require('dotenv').config();
const PORT = process.env.PORT || 5000;

//Connection to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

//Developing the Schema for the Database

const FormDataSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    number: String,
    email: String,
})

//This is the model for the database
//The model is used to interact with the database
const FormData = mongoose.model("FormData", FormDataSchema);

//This is the route that the front-end will send the data to
//The data is then saved to the database and a response is sent back to the front-end
app.post("/submit", async (req, res) => {
    const { fName, lName, number, email} = req.body;

    //If fields are missing
    if (!fName || !lName || !number || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    //Validating the phone number
    if(!validator.isMobilePhone(number)) {
        return res.status(400).json({ error:"Please enter a valid phone number" });
    }

    //Validating the email
    if(!validator.isEmail(email)) {
        return res.status(400).json({ error:"Invalid Email Format" });
    }
    
    //Creating a new instance of the FormData model
    const formDetails = {fName, lName, number, email};
    //Saving the data to the database
    const newFormDetails = new FormData(formDetails);

    try {
        await newFormDetails.save();
        res.status(200).json({ message: "Data saved successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error saving data to the database" });
    }
});

//Export the app for testing purposes
module.exports = app;

//start the server if the file is called directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}


