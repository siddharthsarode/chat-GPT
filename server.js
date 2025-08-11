require("dotenv").config();
const app = require("./src/app");
const { connectDB } = require("./src/db/db");

const PORT = process.env.PORT || 5000;

// connect to the database
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
