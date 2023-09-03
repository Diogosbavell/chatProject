import { Request, Response } from "express";

export const handleError404 = (req:Request, res:Response)=>{
    res.status(404).send("Page not found!");
}