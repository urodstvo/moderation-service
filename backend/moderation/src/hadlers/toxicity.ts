import { Router, Request, Response } from "express";
import "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";
import { isClient } from "../middleware";

const threshold = 0.5;
const labels = ["identity_attack", "insult", "obscene", "severe_toxicity", "threat", "toxicity"];

let model: toxicity.ToxicityClassifier;
toxicity.load(threshold, labels).then((m) => (model = m));

type PredictionResponse = Array<{
    sentence: string;
    toxicity: Array<{
        label: string;
        score: number;
    }>;
}>;

const router = Router();

router.get("/text", isClient, async (req: Request, res: Response) => {
    const text = req.query.query as string;
    const sentences = text
        .split(".")
        .map((sentence) => sentence.trim())
        .filter((sentence) => !!sentence);

    if (!text) return res.status(400).send("No text provided");

    let predictions: PredictionResponse = [];
    for (const sentence of sentences) {
        const predicts = await model.classify(sentence);
        const formatted_predicts = predicts.map((v) => ({
            label: v.label,
            score: v.results[0].probabilities[1],
        }));
        predictions.push({ sentence: sentence, toxicity: formatted_predicts });
    }

    return res.status(200).send({ predictions });
});

export default router;
