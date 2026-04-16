import { prisma } from "@/config/prisma";
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

  const result = await prisma.task.findMany({
    where: {
      userId,
      status,
      priority,
      title: search
        ? {
            contains: search,
          }
        : undefined
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      deadline: true
    },
    skip: page && limit ? (page - 1) * (limit) : undefined,
    take: limit ?? undefined,
    orderBy: sort
  });

  return result;
};

const handleCreateTask = async (userId: number, taskData: TTaskSchema) => {
    const result = await prisma.task.create({
            data: {
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
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
    const result = await prisma.task.updateMany({
        where: {
            id: taskId,
            userId: userId
        },
        data: updateData
    });
    
    return result;
}

const handleDeleteTask = async (userId: number, taskId: number) => {
    const result = await prisma.task.deleteMany({
        where: {
            id: +taskId,
            userId: +userId
        }
    });
    return result;
}

export { handleGetAllTasks,handleCreateTask,handleFindTaskById,handleUpdateTask,handleDeleteTask }