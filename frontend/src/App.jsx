import { useEffect, useState } from "react";

function App()
{
    const [internships, setInternships] = useState([]);
    const [search, setSearch] = useState("");
    const [domain, setDomain] = useState("");
    const [mode, setMode] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedInternship, setSelectedInternship] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [portfolioUrl, setPortfolioUrl] = useState("");
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchInternships = () =>
    {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search)
        {
            params.append("search", search);
        }

        if (domain)
        {
            params.append("domain", domain);
        }

        if (mode)
        {
            params.append("mode", mode);
        }

        fetch(`http://localhost:5000/api/internships?${params.toString()}`)
            .then((response) =>
            {
                if (!response.ok)
                {
                    throw new Error("Failed to load internships");
                }

                return response.json();
            })
            .then((result) =>
            {
                setInternships(result.data);
                setLoading(false);
            })
            .catch(() =>
            {
                setError("Unable to load internships. Please try again.");
                setLoading(false);
            });
    };

    useEffect(() =>
    {
        fetchInternships();
    }, []);

    const handleSearch = (event) =>
    {
        event.preventDefault();
        fetchInternships();
    };

    const openApplicationForm = (internship) =>
    {
        setSelectedInternship(internship);
        setName("");
        setEmail("");
        setPortfolioUrl("");
        setFormError("");
        setFormSuccess("");
    };

    const closeApplicationForm = () =>
    {
        setSelectedInternship(null);
        setFormError("");
        setFormSuccess("");
    };

    const handleApplicationSubmit = async (event) =>
    {
        event.preventDefault();

        setFormError("");
        setFormSuccess("");

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPortfolioUrl = portfolioUrl.trim();

        if (trimmedName.length < 2)
        {
            setFormError("Name must contain at least 2 characters.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(trimmedEmail))
        {
            setFormError("Please enter a valid email address.");
            return;
        }

        if (trimmedPortfolioUrl)
        {
            try
            {
                const url = new URL(trimmedPortfolioUrl);

                if (url.protocol !== "http:" && url.protocol !== "https:")
                {
                    setFormError("Portfolio URL must use http or https.");
                    return;
                }
            }
            catch
            {
                setFormError("Please enter a valid portfolio URL.");
                return;
            }
        }

        setSubmitting(true);

        try
        {
            const response = await fetch("http://localhost:5000/api/applications",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    internship_id: selectedInternship.id,
                    name: trimmedName,
                    email: trimmedEmail,
                    portfolio_url: trimmedPortfolioUrl || null
                })
            });

            const result = await response.json();

            if (!response.ok)
            {
                setFormError(result.message || "Unable to submit application.");
                setSubmitting(false);
                return;
            }

            setFormSuccess("Application submitted successfully!");
            setSubmitting(false);
        }
        catch
        {
            setFormError("Unable to connect to the server.");
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Internship Board</h1>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search internships"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <select
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                >
                    <option value="">All Domains</option>
                    <option value="Full Stack Development">
                        Full Stack Development
                    </option>
                    <option value="UI/UX">
                        UI/UX
                    </option>
                    <option value="Data Analytics">
                        Data Analytics
                    </option>
                    <option value="Cyber Security">
                        Cyber Security
                    </option>
                </select>

                <select
                    value={mode}
                    onChange={(event) => setMode(event.target.value)}
                >
                    <option value="">All Work Modes</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                </select>

                <button type="submit">
                    Search
                </button>
            </form>

            {loading && <h2>Loading internships...</h2>}

            {error && (
    <div>
        <h2>{error}</h2>
        <button type="button" onClick={fetchInternships}>
            Retry
        </button>
    </div>
)}

            {!loading && !error && internships.length === 0 && (
                <h2>No internships found.</h2>
            )}

            {!loading && !error && internships.length > 0 && (
                <div>
                    {internships.map((internship) => (
                        <div key={internship.id}>
                            <h2>{internship.title}</h2>
                            <p>Domain: {internship.domain}</p>
                            <p>Mode: {internship.mode}</p>
                            <p>Location: {internship.location}</p>
                            <p>Skills: {internship.skills.join(", ")}</p>
                            <p>Openings: {internship.openings}</p>

                            <button
                                type="button"
                                onClick={() => openApplicationForm(internship)}
                            >
                                Apply
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedInternship && (
                <div>
                    <h2>
                        Apply for {selectedInternship.title}
                    </h2>

                    {formError && (
                        <p>{formError}</p>
                    )}

                    {formSuccess && (
                        <p>{formSuccess}</p>
                    )}

                    {!formSuccess && (
                        <form onSubmit={handleApplicationSubmit}>
                            <div>
                                <label htmlFor="name">
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="portfolio">
                                    Portfolio URL
                                </label>

                                <input
                                    id="portfolio"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={portfolioUrl}
                                    onChange={(event) => setPortfolioUrl(event.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? "Submitting..." : "Submit Application"}
                            </button>

                            <button
                                type="button"
                                onClick={closeApplicationForm}
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;