const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const internshipRoutes = require("./routes/internships");
const applicationRoutes = require("./routes/applications");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use("/api", limiter);

app.get("/api/health", (req, res) =>
{
    res.json({
        status: "success",
        message: "API is running"
    });
});

app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);

module.exports = app;