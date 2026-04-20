import { prisma } from "@/config/prisma";
import { handleCleanOTPs } from "@/services/auth.service";
import nodeCron from "node-cron";

const startOtpCleanupJob = () => {
  nodeCron.schedule("0 0 * * *", async () => {
    try {
      const result = await handleCleanOTPs();

      console.log(`Deleted ${result.count} expired OTP(s)`);
    } catch (error) {
      console.error("OTP cleanup error:", error);
    }
  });
};

export default startOtpCleanupJob;