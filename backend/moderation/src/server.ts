import express, { Express, Response } from "express";

const app: Express = express();
const port: number = 8000;

app.get("/", (_, res: Response) => {
    res.status(200).send("Hello World!");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
