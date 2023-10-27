require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/not-found");
const authRoute = require("./routes/auth-route");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use("/auth", authRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
