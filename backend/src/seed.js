const fs = require("fs");
const path = require("path");
const db = require("./db");

const filePath = path.join(__dirname, "../data/internships.json");
const internships = JSON.parse(fs.readFileSync(filePath, "utf8"));

const insert = db.prepare(`
    INSERT OR REPLACE INTO internships
    (id, title, domain, mode, location, skills, openings)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const seed = db.transaction(() =>
{
    for (const internship of internships)
    {
        insert.run(
            internship.id,
            internship.title,
            internship.domain,
            internship.mode,
            internship.location,
            JSON.stringify(internship.skills),
            internship.openings
        );
    }
});

seed();

console.log(`${internships.length} internships added to the database.`);