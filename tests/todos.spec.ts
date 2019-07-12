import * as request from "supertest";
import {
    app,
    startServer,
    stopServer
} from "../src/app"
describe(`Todos Test Suit for GET and POST requests`, () => {
    let token = {};
    beforeAll(async () => {
        startServer()
        const response = await request(app).get("/api/token/get");
        token = response.text;
    });
    afterAll(() => stopServer());

    test('api must issue valid token', async done => {
        const verification = await request(app).get("/api/token/verify").set({
            "x-token": token
        });
        expect(verification).toBeTruthy();
        done();
    });
    test("api must issue 403, if token not present", async done => {
        const verification = await request(app).get("/api/token/verify");
        const {
            status
        } = verification;
        expect(status).toBe(403);
        done();
    })
    test("api must not create ToDo, if token absent", async done => {
        const todo = await request(app).post("/api/todos/").set({
            "Content-type": "application/json"
        });
        const {
            status
        } = todo;
        expect(status).toBe(403);
        done();
    });
    test("api must not create ToDo, if token present, but Todo schema is not valid.", async done => {
        const todo = await request(app).post("/api/todos/").send({
            "description": ""
        }).set({
            "x-token": token
        });
        const {
            status
        } = todo;
        expect(status).toBe(422);
        done();
    })
    test("api must create ToDo, if token present and schema is valid.", async done => {
        const todo = await request(app).post("/api/todos/").send({
            "description": "This is a test description.Check database."
        }).set({
            "x-token": token,
            "Content-type": "application/json"
        });
        const {
            status
        } = todo;
        expect(status).toBe(200);
        done();

    })
    test("api must not get ToDos, if token absent", async done => {
        const todo = await request(app).get("/api/todos/");
        const {
            status
        } = todo;
        expect(status).toBe(403);
        done();
    });
    test("api must get ToDo, if token present.", async done => {
        const todo = await request(app).get("/api/todos/").set({
            "x-token": token
        });
        const {
            status
        } = todo;
        expect(status).toBe(200);
        done();

    })
})
describe('Todos Test Suit for PUT and DELETE requests', () => {
    let token = {};
    let generalId = "";
    beforeAll(async () => {
        startServer()
        const response = await request(app).get("/api/token/get");
        token = response.text;
    });
    beforeEach(async () => {
        const todoInserted = await request(app).post("/api/todos/").send({
            "description": "This is a test description.Check database."
        }).set({
            "x-token": token,
            "Content-type": "application/json"
        });
        const {
            body
        } = todoInserted;
        generalId = body.ops[0]._id
    })
    afterAll(() => stopServer());
    test("api must not update ToDo, if token absent", async done => {
        const todo = await request(app).put(`/api/todos/${generalId}`).set({
            "Content-type": "application/json"
        });
        const {
            status
        } = todo;
        expect(status).toBe(403);
        done();
    });
    test("api must not update ToDo, if token present, but Todo schema is not valid.", async done => {
        const todo = await request(app).put(`/api/todos/${generalId}`).send({
            "description": ""
        }).set({
            "x-token": token
        });
        const {
            status
        } = todo;
        expect(status).toBe(422);
        done();
    })
    test("api must update ToDo, if token present and schema is valid.", async done => {
        const todo = await request(app).put(`/api/todos/${generalId}`).send({
            "description": `This is a test description.Check database for updating of ${generalId}.`
        }).set({
            "x-token": token,
            "Content-type": "application/json"
        });
        const {
            status
        } = todo;
        expect(status).toBe(200);
        done();
    });
    //Delete
    test("api must not delete ToDo, if token absent", async done => {
        const todo = await request(app).delete(`/api/todos/${generalId}`);
        const {
            status
        } = todo;
        expect(status).toBe(403);
        done();
    });
    test("api must delete ToDo, if token present.", async done => {
        const todo = await request(app).delete(`/api/todos/${generalId}`).set({
            "x-token": token
        });
        const {
            status
        } = todo;
        expect(status).toBe(200);
        done();
    });

})