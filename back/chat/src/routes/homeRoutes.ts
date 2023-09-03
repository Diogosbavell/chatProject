import { Router } from "express";
import * as homeController from "../controllers/homeControllers";

//instance routes
const routes= Router();

//routes
routes.get("/",homeController.home);

//export
export default routes;