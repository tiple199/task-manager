import { createUserAPI, loginAPI } from "@/controllers/auth.controller";
import { deleteTaskAPI, editTaskAPI, getAllTasksAPI, getTaskByIdAPI, postTaskAPI } from "@/controllers/task.controller";
import { getUserByIdAPI } from "@/controllers/user.controller";
import { checkValidJWT } from "@/middlewares/jwt.middleware";
import express,{Express} from "express";
const router = express.Router();

const apiRoutes = (app: Express) => {
    router.post("/register", createUserAPI);
    router.post("/login", loginAPI);

    router.get("/profile", getUserByIdAPI);

    router.get("/tasks", getAllTasksAPI);
    router.post("/tasks", postTaskAPI);
    router.get("/tasks/:id", getTaskByIdAPI);
    router.put("/tasks/:id", editTaskAPI);
    router.delete("/tasks/:id", deleteTaskAPI);



    app.use("/api",checkValidJWT, router);
};

export default apiRoutes;