import request from "supertest";
import { describe, test, expect } from "vitest";
import app from "../src/app";

describe("Application API", () =>
{
    test("rejects an invalid name", async () =>
    {
        const response = await request(app)
            .post("/api/applications")
            .send({
                internship_id: "INT-101",
                name: "A",
                email: "test@example.com"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            "Name must contain at least 2 characters"
        );
    });

    test("accepts a valid application", async () =>
    {
        const response = await request(app)
            .post("/api/applications")
            .send({
                internship_id: "INT-102",
                name: "Automated Test User",
                email: `automated-${Date.now()}@example.com`,
                portfolio_url: "https://example.com"
            });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe("success");
        expect(response.body.message).toBe(
            "Application submitted successfully"
        );
    });
});