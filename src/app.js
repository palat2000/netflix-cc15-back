require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimitMiddleware = require("./middlewares/rate-limit");
const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/not-found");
const authRoute = require("./routes/auth-route");
const userBrowseRoute = require("./routes/user-browse-route");
const userRoute = require("./routes/user-route");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("combined"));
app.use(rateLimitMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoute);
app.use("/user-browse", userBrowseRoute);
app.use("/user", userRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
