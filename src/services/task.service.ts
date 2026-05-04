import { prisma } from "@/config/prisma";
import AppError from "@/utils/appError";
import { PRIORITY_MAP, PRIORITY_REVERSE } from "@/utils/priority.mapper";
import { TTaskSchema } from "@/validation/task.schema";

const handleGetAllTasks = async (
  userId: number,
  status?: string,
  priority?: string,
  search?: string,
  page?: number,
  limit?: number,
  sort?: {[x: string]: string;}
) => {


  const statusFilter =
    status === 'not_completed'
      ? { in: ['pending', 'in_progress'] }  
      : status ?? undefined;                 

  const where = {
    userId,
    status: statusFilter,
    priority: priority ? PRIORITY_REVERSE[priority as keyof typeof PRIORITY_REVERSE] : undefined,
    title: search ? { contains: search } : undefined,
  };

  const result = await prisma.task.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      deadline: true
    },
    skip: page && limit ? (page - 1) * limit : undefined,
    take: limit ?? undefined,
    orderBy: sort
  });

  const count = await prisma.task.count({ where });

  return { tasks: result, count };
};


const handleCreateTask = async (userId: number, taskData: TTaskSchema) => {
    const result = await prisma.task.create({
            data: {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                ...(taskData.priority !== undefined && { priority: PRIORITY_REVERSE[taskData.priority] }),
                deadline: taskData.deadline,
                userId: +userId
            }
        });
        return result;
}

const handleFindTaskById = async (userId: number, taskId: number) => {
    const task = await prisma.task.findFirst({
        where: {
            id: taskId,
            userId: userId
        },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            deadline: true
        }
    });
    return task;
}

const handleUpdateTask = async (userId: number, taskId: number, updateData: Partial<TTaskSchema>) => {
  const id = await prisma.task.findFirst({
        where: {
            id: taskId,
            userId: userId
        },
        select: {
            id: true
        }
    });
    if (!id) {
        throw new AppError("Task not found or unauthorized.", 400);
    }
  
  const data: any = { ...updateData };
  if (updateData.priority !== undefined) {
    data.priority = PRIORITY_REVERSE[updateData.priority];
  }
  
  const result = await prisma.task.updateMany({
        where: {
            id: taskId,
            userId: userId
        },
        data
    });
    
    return result;
}

const handleDeleteTask = async (userId: number, taskId: number) => {
    const id = await prisma.task.findFirst({
        where: {
            id: taskId,
            userId: userId
        },
        select: {
            id: true
        }
    });
    if (!id) {
        throw new AppError("Task not found or unauthorized.", 400);
    }
    const result = await prisma.task.deleteMany({
        where: {
            id: +taskId,
            userId: +userId
        }
    });
    return result;
}

export { handleGetAllTasks,handleCreateTask,handleFindTaskById,handleUpdateTask,handleDeleteTask }