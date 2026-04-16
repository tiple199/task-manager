import { createUserAPI, loginAPI } from "@/controllers/auth.controller";
import { createTaskAPI, deleteTaskAPI, editTaskAPI, getAllTasksAPI, getTaskByIdAPI } from "@/controllers/task.controller";
import { getUser } from "@/controllers/user.controller";
import { checkValidJWT } from "@/middlewares/jwt.middleware";
import { AsyncHandler } from "@/types/asyncHandler";
import asyncHandler from "@/utils/asyncHandler";
import express,{Express} from "express";
const router = express.Router();
const wrap = (fn: AsyncHandler) => asyncHandler(fn);

const apiRoutes = (app: Express) => {
    router.post("/register", wrap(createUserAPI));
    router.post("/login", wrap(loginAPI));

    router.get("/profile", getUser);

    router.get("/tasks", wrap(getAllTasksAPI));
    router.post("/tasks", wrap(createTaskAPI));
    router.get("/tasks/:id", wrap(getTaskByIdAPI));
    router.put("/tasks/:id", wrap(editTaskAPI));
    router.delete("/tasks/:id", wrap(deleteTaskAPI));



    app.use("/api",checkValidJWT, router);
};

export default apiRoutes;