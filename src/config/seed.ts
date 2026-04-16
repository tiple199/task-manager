import { hashPassword } from "@/services/auth.service";
import { prisma } from "./prisma";

const initDatabase = async () => {
    const countUsers = await prisma.user.count();
    if (countUsers === 0) {
        const user = await prisma.user.create({
            data: {
                email: "tiep123@gmail.com",
                password: await hashPassword("12345678"),
                fullName: "Tiep Le"
            }
        });

        await prisma.task.createMany({
            data: [
                {
                    title: "Prepare weekly report",
                    description: "Collect progress updates and summarize completed work.",
                    status: "pending",
                    priority: "high",
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    userId: user.id
                },
                
            ]
        });
    }




}

export default initDatabase;