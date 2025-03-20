const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

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

const FormData = mongoose.model("FormData", FormDataSchema);

//This is the route that the front-end will send the data to
//The data is then saved to the database and a response is sent back to the front-end
app.post("/submit", async (req, res) => {
    const formDetails = req.body;

    const newFormDetails = new FormData(formDetails);

    try {
        await newFormDetails.save();
        res.send("Data saved successfully!");
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


