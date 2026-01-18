-- CreateTable
CREATE TABLE "TransferAudit" (
    "id" SERIAL NOT NULL,
    "transferId" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransferAudit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransferAudit" ADD CONSTRAINT "TransferAudit_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "Transfer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
