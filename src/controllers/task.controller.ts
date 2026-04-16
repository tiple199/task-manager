import { handleCreateTask, handleDeleteTask, handleFindTaskById, handleGetAllTasks, handleUpdateTask } from "@/services/task.service";
import { taskSchema, TTaskSchema, TUpdateTaskSchema, updateTaskSchema } from "@/validation/task.schema";
import { taskQuerySchema } from "@/validation/taskQuery.schema";
import { Request, Response } from "express";

const getAllTasksAPI = async (req: Request, res: Response) => {
  try {
    const validation = await taskQuerySchema.safeParseAsync(req.query);
    if (!validation.success) {
      const errorZod = validation.error.issues;
      const errors = errorZod.map((item)=>{
        return {
          field: String(item.path[0] ?? "general"),
          message: item.message
        }
      })
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors
      });
    }
    const {
        status: taskStatus,
        priority,
        search,
        page,
        limit,
        sort
    } = validation.data;

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
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
  } catch (error) {
    console.error("getAllTasksAPI error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const postTaskAPI = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({
            success : false,
            message: "Unauthorized",
     });
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
        return res.status(400).json({
            success: false,
            message: errors
        });
        
    }
    const task = await handleCreateTask(+userId, validation.data);
    return res.status(201).json({
        success: true,
        message: "Task created successfully.",
        data: task
    });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

const getTaskByIdAPI = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({
            success : false,
            message: "Unauthorized",
     });
    }
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id."
      });
    }
    
    const task = await handleFindTaskById(+userId, +taskId);
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found.",
            data: null
        });
    }
    return res.status(200).json({
        success: true,
        data: task
    });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

const editTaskAPI = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({
            success : false,
            message: "Unauthorized",
     });
    }
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id."
      });
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
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors
        });
    }
    if (Object.keys(validation.data).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No valid fields provided for update."
    });
    }
        const result = await handleUpdateTask(+userId, +taskId, validation.data);
        // updateMany returns count of updated records, if it's 0 means task not found or user doesn't have permission to edit
        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found.",
                data: null
            });
        }
        return res.status(200).json({
            success: true,
            message: "Task updated successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}

const deleteTaskAPI = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({
            success : false,
            message: "Unauthorized",
     });
    }
    const taskId = Number(req.params.id);

    if (Number.isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id."
      });
    }
    const result = await handleDeleteTask(+userId, +taskId);
    // deleteMany returns count of deleted records, if it's 0 means task not found or user doesn't have permission to delete
    if (result.count === 0) {
        return res.status(404).json({
            success: false,
            message: "Task not found.",
            data: null
        });
    }
    return res.status(200).json({
        success: true,
        message: "Task deleted successfully."
    });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}
export { getAllTasksAPI,postTaskAPI,getTaskByIdAPI,editTaskAPI,deleteTaskAPI }