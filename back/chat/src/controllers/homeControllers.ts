import { Request, Response } from "express";
import path from "path";

export const ping = (req: Request, res: Response) => {
  res.json({ ping: "pong" });
};

export const home=(req:Request, res:Response)=>{
  res.sendFile('index.html', path.join(__dirname, "./public"));
}
