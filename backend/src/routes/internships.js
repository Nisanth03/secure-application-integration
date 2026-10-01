const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", (req, res) =>
{
    try
    {
        const { domain, mode, search } = req.query;

        let query = `
            SELECT id, title, domain, mode, location, skills, openings
            FROM internships
            WHERE 1 = 1
        `;

        const params = [];

        if (domain)
        {
            query += " AND domain = ?";
            params.push(domain);
        }

        if (mode)
        {
            query += " AND mode = ?";
            params.push(mode);
        }

        if (search)
        {
            query += " AND (title LIKE ? OR domain LIKE ? OR location LIKE ?)";
            const searchValue = `%${search}%`;
            params.push(searchValue, searchValue, searchValue);
        }

        query += " ORDER BY id";

        const internships = db.prepare(query).all(...params);

        const formattedInternships = internships.map((internship) =>
        {
            return {
                ...internship,
                skills: JSON.parse(internship.skills)
            };
        });

        res.json({
            status: "success",
            data: formattedInternships
        });
    }
    catch (error)
    {
        console.error("Failed to fetch internships:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch internships"
        });
    }
});

module.exports = router;