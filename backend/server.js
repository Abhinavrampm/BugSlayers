const express = require("express");
const cors = require("cors");

const doshaRoutes = require("./routes/doshaRoutes"); // Import the doshaRoutes API

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/dosha", doshaRoutes); // Mount doshaRoutes under /api/dosha

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
