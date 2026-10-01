const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/", (req, res) =>
{
    try
    {
        const { internship_id, name, email, portfolio_url } = req.body;

        if (!internship_id || !name || !email)
        {
            return res.status(400).json({
                status: "error",
                message: "Internship, name and email are required"
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (trimmedName.length < 2)
        {
            return res.status(400).json({
                status: "error",
                message: "Name must contain at least 2 characters"
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(trimmedEmail))
        {
            return res.status(400).json({
                status: "error",
                message: "Invalid email address"
            });
        }

        let safePortfolioUrl = null;

        if (portfolio_url)
        {
            try
            {
                const parsedUrl = new URL(portfolio_url);

                if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:")
                {
                    throw new Error("Unsafe URL");
                }

                safePortfolioUrl = parsedUrl.toString();
            }
            catch
            {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid portfolio URL"
                });
            }
        }

        const internship = db.prepare(
            "SELECT id FROM internships WHERE id = ?"
        ).get(internship_id);

        if (!internship)
        {
            return res.status(404).json({
                status: "error",
                message: "Internship not found"
            });
        }

        const existingApplication = db.prepare(`
            SELECT id
            FROM applications
            WHERE internship_id = ? AND email = ?
        `).get(internship_id, trimmedEmail);

        if (existingApplication)
        {
            return res.status(409).json({
                status: "error",
                message: "You have already applied for this internship"
            });
        }

        const result = db.prepare(`
            INSERT INTO applications
            (internship_id, name, email, portfolio_url, created_at)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            internship_id,
            trimmedName,
            trimmedEmail,
            safePortfolioUrl,
            new Date().toISOString()
        );

        res.status(201).json({
            status: "success",
            message: "Application submitted successfully",
            data: {
                id: result.lastInsertRowid
            }
        });
    }
    catch (error)
    {
        console.error("Application submission failed:", error.message);

        res.status(500).json({
            status: "error",
            message: "Unable to submit application"
        });
    }
});

module.exports = router;