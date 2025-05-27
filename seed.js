const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/smartrent', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Listing = mongoose.model('Listing', new mongoose.Schema({
  title: String,
  location: String,
  price: String,
  amenities: [String]
}));

async function seed() {
  await Listing.deleteMany(); // optional: clears old data
  await Listing.insertMany([
    {
      title: "2BHK in Madhapur",
      location: "Madhapur, Hyderabad",
      price: "₹18,000/month",
      amenities: ["WiFi", "Parking", "Lift"]
    },
    {
      title: "1RK in Ameerpet",
      location: "Ameerpet, Hyderabad",
      price: "₹8,500/month",
      amenities: ["Water", "Fan", "Bed"]
    }
  ]);
  console.log("Sample listings added");
  mongoose.disconnect();
}

seed();
