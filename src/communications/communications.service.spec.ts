import { Injectable } from '@nestjs/common';

@Injectable()
export class CommunicationsService {
  handleIncomingMessage(body: any) {
    const now = new Date();

    const hour = now.getHours();
    const day = now.getDay();

    const isSunday = day === 0;
    const isOutsideSchedule = hour < 8 || hour >= 18 || isSunday;

    const from = body.From || 'desconocido';
    const message = body.Body || '';

    console.log('WhatsApp simulado recibido:', {
      from,
      message,
      hour,
      day,
      isOutsideSchedule,
    });

    if (isOutsideSchedule) {
      return {
        ok: true,
        simulated: true,
        mode: 'outside_schedule',
        reply:
          'Gracias por escribir a Discovery Innova. En este momento estamos fuera de horario. Un asesor se comunicará contigo en cuanto retomemos la atención.',
      };
    }

    return {
      ok: true,
      simulated: true,
      mode: 'business_hours',
      reply:
        'Hemos recibido tu mensaje. Un asesor te responderá en breve.',
    };
  }
}