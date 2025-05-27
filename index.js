const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema & Model
const ListingSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: String,
  amenities: [String]
});

const Listing = mongoose.model('Listing', ListingSchema);

// Routes
app.get('/listings', async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});

app.post('/listings', async (req, res) => {
  const newListing = new Listing(req.body);
  await newListing.save();
  res.json({ message: 'Listing added' });
});

app.post('/chat', async (req, res) => {
  const message = req.body.message.toLowerCase();
  let query = {};

  if (message.includes('2bhk')) query.title = /2BHK/i;
  if (message.includes('1rk')) query.title = /1RK/i;
  if (message.includes('ameerpet')) query.location = /ameerpet/i;
  if (message.includes('madhapur')) query.location = /madhapur/i;
  if (message.includes('cheap') || message.includes('under') || message.includes('below 10000'))
    query.price = /[5-9],?\d{2,3}/i;

  const results = await Listing.find(query);
  if (results.length === 0) {
    return res.json({ reply: "Sorry, I couldn't find any listings that match that." });
  }

  const reply = results.map(l => `${l.title} in ${l.location} for ${l.price}`).join('\n');
  res.json({ reply });
});
const PORT = process.env.PORT || 5000;
// Server Start
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});