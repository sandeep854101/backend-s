import { Router } from "express";
import { createCourse } from "../controller/Course.controller.js";

const courseRoute = Router();

// POST route to create a new course
courseRoute.post("/new-course", createCourse);

export default courseRoute;
