import { handleCreateTask, handleDeleteTask, handleFindTaskById, handleGetAllTasks, handleUpdateTask } from "@/services/task.service";
import AppError from "@/utils/appError";
import { taskSchema, TTaskSchema, TUpdateTaskSchema, updateTaskSchema } from "@/validation/task.schema";
import { taskQuerySchema } from "@/validation/taskQuery.schema";
import { Request, Response } from "express";

const getAllTasksAPI = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }

    const validation = await taskQuerySchema.safeParseAsync(req.query);
    if (!validation.success) {
      const errorZod = validation.error.issues;
      const errors = errorZod.map((item)=>{
        return {
          field: String(item.path[0] ?? "general"),
          message: item.message
        }
      })
      throw new AppError("Validation failed", 400, errors);
    }
    const {
        status: taskStatus,
        priority,
        search,
        page,
        limit,
        sort
    } = validation.data;

    
    const tasks = await handleGetAllTasks(
      Number(userId),
      taskStatus,
      priority,
      search,
      page,
      limit,
      sort
    );

    return res.status(200).json({
      success: true,
      data: {
        tasks,
        count: tasks.length
      }
    });
  
};

const createTaskAPI = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }

    const { title, description, status, priority, deadline } = req.body as TTaskSchema;
    const validation = await taskSchema.safeParseAsync({ title, description, status, priority, deadline });
    if (!validation.success) {
        const errorZod = validation.error.issues;
        const errors = errorZod.map((item)=>{
            return {
                field: String(item.path[0] ?? "general"),
                message: item.message
            }
        })
        throw new AppError("Validation failed", 400, errors);
        
    }
    const task = await handleCreateTask(+userId, validation.data);
    return res.status(201).json({
        success: true,
        message: "Task created successfully.",
        data: task
    });
    
}

const getTaskByIdAPI = async (req: Request, res: Response) => {
        const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      throw new AppError("Invalid task id.", 400);
    }
    
    const task = await handleFindTaskById(+userId, +taskId);
    if (!task) {
        throw new AppError("Task not found.", 404);
    }
    return res.status(200).json({
        success: true,
        data: task
    });
    
}

const editTaskAPI = async (req: Request, res: Response) => {
        const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      throw new AppError("Invalid task id.", 400);
    }
    const { title, description, status, priority, deadline } = req.body as TUpdateTaskSchema;
    const validation = await updateTaskSchema.safeParseAsync({ title, description, status, priority, deadline });
    if (!validation.success) {
        const errorZod = validation.error.issues;
        const errors = errorZod.map((item)=>{
            return {
                field: String(item.path[0] ?? "general"),
                message: item.message
            }
        })
        throw new AppError("Validation failed", 400, errors);
    }
    if (Object.keys(validation.data).length === 0) {
        throw new AppError("At least one field must be provided for update.", 400);
    }
        const result = await handleUpdateTask(+userId, +taskId, validation.data);
        // updateMany returns count of updated records, if it's 0 means task not found or user doesn't have permission to edit
        if (result.count === 0) {
            throw new AppError("Task not found.", 404);
        }
        return res.status(200).json({
            success: true,
            message: "Task updated successfully."
        });
    
}

const deleteTaskAPI = async (req: Request, res: Response) => {

        const userId = req.user?.userId;
    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      throw new AppError("Invalid task id.", 400);
    }
    const result = await handleDeleteTask(+userId, +taskId);
    // deleteMany returns count of deleted records, if it's 0 means task not found or user doesn't have permission to delete
    if (result.count === 0) {
       throw new AppError("Task not found.", 404);
    }
    return res.status(200).json({
        success: true,
        message: "Task deleted successfully."
    });
    
}
export { getAllTasksAPI,createTaskAPI,getTaskByIdAPI,editTaskAPI,deleteTaskAPI }