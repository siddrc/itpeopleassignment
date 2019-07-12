import * as request from "supertest";
import {ObjectID} from "mongodb";
import {
    app,
    startServer,
    stopServer
} from "../src/app";
describe(`Todos Test Suit for ERROR(s) of POST requests`, () => {
    let token = {};
    let generalId = "";
    beforeAll(async () => {
        startServer()
        const response = await request(app).get("/api/token/get");
        token = response.text;
        await request(app).post("/api/todos/").send({
            "description":"This is a very very very long desription of the todo..."
        }).set({
            "x-token": token,
            "Content-type": "application/json"
        });
    });
    beforeEach(async () => {
        const todoInserted = await request(app).get("/api/todos/").set({
            "x-token": token,
            "Content-type": "application/json"
        });
        const {
            body
        } = todoInserted;
        generalId = body[0]._id
    })
    afterAll(() => stopServer());
    test("api must not create ToDo, and throw error for duplicate _id value", async done => {
        const todo = await request(app).post("/api/todos/").send({"description":"this description clause is suppose to throw a error","_id":new ObjectID(generalId)}).set({
            "x-token":token,
            "Content-type": "application/json"
        });
        const {
            status
        } = todo;
        expect(status).toBe(500);
        done();
    });
    test("api must not update ToDo, if no _id match", async done => {
        const todo = await request(app).put(`/api/todos/${new ObjectID().toHexString()}`).send({"description":"This description will not update, rather it will throw a fit."}).set({
            "x-token":token
        });
        const {
            status
        } = todo;
        expect(status).toBe(500);
        done();
    });
    test("api must not delete ToDo, if no _id match", async done => {
        const todo = await request(app).delete(`/api/todos/${new ObjectID().toHexString()}`).set({
            "x-token":token
        });
        const {
            status
        } = todo;
        expect(status).toBe(500);
        done();
    });
})