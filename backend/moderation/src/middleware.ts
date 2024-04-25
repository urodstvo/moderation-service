import { NextFunction, Request, Response } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!("Authorization" in req.headers)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    //TODO: JWT VERIFICATION

    return next();
}

export function isClient(req: Request, res: Response, next: NextFunction) {
    if (req.hostname !== "localhost") return isAuthenticated(req, res, next);

    return next();
}
