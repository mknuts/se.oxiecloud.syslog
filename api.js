'use strict';

module.exports = {
  /**
   * testConnection anropas från inställningssidan.
   * Vi använder 'homey.app' för att nå metoderna i din SyslogApp-klass (app.js).
   */
  async testConnection({ homey, body }) {
    // Vi skickar ett testmeddelande för att verifiera anslutningen
    try {
      await homey.app.sendToSyslog({
        message: 'Test message from Homey settings page',
        severity: '6',
        tag: 'Test',
        hostname: 'Homey'
      });
      
      // Vi returnerar något till HTML-sidan så den vet att det gick bra
      return { status: 'ok' };
    } catch (error) {
      // Om något går fel (t.ex. ingen IP konfigurerad) kastar vi felet vidare
      throw new Error(error.message || 'Failed to send test message');
    }
  },
};