const express = require("express");
const request = require("supertest");
const { usersRouter } = require("../routers/usersRouter");
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
jest.setTimeout(15000);

const { connectMongo } = require("../db/connection");

const app = express();
app.use(express.json());
app.use("/api/users", usersRouter);

const user = {
  email: "serhiy22@gmail.com",
  password: "password",
  subscription: false,
};

describe("test userSignup controller", () => {
  beforeAll(async () => {
    app.listen(3000);
    connectMongo();
    console.log(`Server works at port 3000!`);
  });
  test("userSignup return status 201", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .set("Content-Type", "application/json")
      .set("Accept", /json/)
      .send(user);
    expect(response.status).toBe(201);
    const { email, subscription } = response.body.user;
    expect(typeof email).toBe("string");
    expect(typeof subscription).toBe("string");
  });
});
afterAll(async () => await mongoose.connection.close);
