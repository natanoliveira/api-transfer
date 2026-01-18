export interface TransferAuditRepository {
  create(entry: { transferId: string; eventType: string; payload: Record<string, unknown> }): Promise<void>;
}
