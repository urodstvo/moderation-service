import { Router, Request, Response } from "express";

import { classifyText } from "./textClassification";

const router = Router();

router.get("/text", async (req: Request, res: Response) => {
    const text = req.query.query as string;
    try {
        const predictions = await classifyText(text);
        return res.status(200).send({ predictions });
    } catch (error) {
        return res.status(500).send({ error });
    }
});

export default router;
