import "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";

const threshold = 0.5;
const labels = ["identity_attack", "insult", "obscene", "severe_toxicity", "threat", "toxicity"];

let model: toxicity.ToxicityClassifier;

toxicity.load(threshold, labels).then((m) => {
    console.log("Loaded model");
    model = m;
});

type PredictionResponse = Array<{
    sentence: string;
    toxicity: Array<{
        label: string;
        score: number;
    }>;
}>;

export const classifyText = async (text: string) => {
    const sentences = text
        .split(".")
        .map((sentence) => sentence.trim())
        .filter((sentence) => !!sentence);

    if (!text) throw Error("No text provided");
    if (!model) throw Error("Model not loaded");

    let predictions: PredictionResponse = [];
    for (const sentence of sentences) {
        const predicts = await model.classify(sentence);
        const formatted_predicts = predicts.map((v) => ({
            label: v.label,
            score: v.results[0].probabilities[1],
        }));
        predictions.push({ sentence: sentence, toxicity: formatted_predicts });
    }

    return predictions;
};
