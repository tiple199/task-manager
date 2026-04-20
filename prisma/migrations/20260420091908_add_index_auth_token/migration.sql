-- CreateIndex
CREATE INDEX `authTokens_email_type_createdAt_idx` ON `authTokens`(`email`, `type`, `createdAt`);

-- CreateIndex
CREATE INDEX `authTokens_email_type_isUsed_idx` ON `authTokens`(`email`, `type`, `isUsed`);
