export interface TransferAuditRepository {
  create(entry: { transferId: number; eventType: string; payload: Record<string, unknown> }): Promise<void>;
}
