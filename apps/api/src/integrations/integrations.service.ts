import { Injectable, Logger } from '@nestjs/common';
import { getAppConfig } from '../config/app-config';

const WEBHOOK_TIMEOUT_MS = 5000;

/**
 * Fires outbound events to an external system webhook. Disabled by default
 * (empty INTEGRATION_WEBHOOK_URL); failures are logged and swallowed so a
 * flaky external endpoint never breaks the sync/inspection flow that
 * triggered it.
 *
 * TODO: adaptor SAP PM / Maximo work order — once the client's target system
 * is known, replace the generic JSON POST below with a call into that
 * system's work-order creation API (mapping `peristiwa`/`payload` accordingly).
 */
@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  async kirimPeristiwa(peristiwa: string, payload: Record<string, unknown>): Promise<void> {
    const url = getAppConfig().integration.webhookUrl;
    if (!url) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ peristiwa, payload, waktu: new Date().toISOString() }),
        signal: controller.signal,
      });
      if (!response.ok) {
        this.logger.warn(`Webhook integrasi gagal: HTTP ${response.status} untuk peristiwa ${peristiwa}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Webhook integrasi gagal untuk peristiwa ${peristiwa}: ${message}`);
    } finally {
      clearTimeout(timeout);
    }
  }
}
