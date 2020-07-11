const request = require("supertest");

const app = require("../../src/app");
const truncate = require("../utils/truncate");
const { User } = require('../../src/app/models');

describe("Authentication", () => {


    beforeEach(async () => {
        await truncate();
    });



    it("should authenticate with valid credentials", async () => {

        const user = await User.create({
            name: "Brenda Martins",
            email: "brendamartins@email.com",
            password: "123456"
        });

        const response = await request(app)
            .post("/auth")
            .send({
                email: user.email,
                password: "123456"
            });

        expect(response.status).toBe(200);
    });

    it("should not authenticate with inválid credentials", async () => {

        const user = await User.create({
            name: "Brenda Martins",
            email: "brendamartins@email.com",
            password: "123456"
        });

        const response = await request(app)
            .post("/auth")
            .send({
                email: user.email,
                password: "abc"
            });

        expect(response.status).toBe(401);
    });

    it("should return a jwt token when authenticated", async () => {


        const user = await User.create({
            name: "Brenda Martins",
            email: "brendamartins@email.com",
            password: "123456"
        });

        const response = await request(app)
            .post("/auth")
            .send({
                email: user.email,
                password: "123456"
            });

        expect(response.body).toHaveProperty('token');
    });

    it("must access private routes when authorized", async () => {
        const user = await User.create({
            name: "Brenda Martins",
            email: "brendamartins@email.com",
            password: "123456"
        });

        const response = await request(app)
            .get("/tools")
            .set("Authorization", `Bearer ${user.generateToken()}`)

        expect(response.status).toBe(200);
    });

    it("should not access private routes without token", async () => {

        const user = await User.create({
            name: "Brenda Martins",
            email: "brendamartins@email.com",
            password: "123456"
        });

        const response = await request(app)
            .get("/tools");

        expect(response.status).toBe(401);
    });


    it("should not access private routes with invalid token", async () => {

        const response = await request(app)
            .get("/tools")
            .set("Authorization", "Bearer 123456789");

        expect(response.status).toBe(401);
    });

}
);



describe("Tools", () => {
    beforeEach(async () => {
        await truncate();
    });


    it("GET /tools should return all tools indexed", async () => {

        const user = await User.create({
            name: "Brenda Martins",
            email: "brendamartins@email.com",
            password: "123456"
        });

        const response = await request(app)
            .get("/tools")
            .set("Authorization", `Bearer ${user.generateToken()}`);

        expect(response.status).toBe(200);
    });


    it("POST /tools should post a tool and return it", async () => {

        const user = await User.create({
            name: "Brenda Martins",
            email: "brendamartins@email.com",
            password: "123456"
        });

        const response = await request(app)
            .post("/tools")
            .set("Authorization", `Bearer ${user.generateToken()}`)
            .send({
                title: "Notion",
                link: "https://notion.so",
                description: "Tool description",
                tags: ["organization",
                    "planning",
                    "collaboration",
                    "writing",
                    "calendar"
                ]
            });

        expect(response.status).toBe(201);
    });

});

