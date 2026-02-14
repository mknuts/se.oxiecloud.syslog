'use strict';

const Homey = require('homey');
const dgram = require('dgram');

class SyslogApp extends Homey.App {

  async onInit() {
    this.log('Syslog App initialized');

    this.homey.flow.getActionCard('send_log_token')
      .registerRunListener(async (args) => {
        const payload = {
          message: args.message,
          severity: args.severity || '6',
          tag: args.tag || 'HomeyFlow',
          hostname: args.hostname || 'Homey'
        };
        return this.sendToSyslog(payload);
      });
  }

  // Metod för att skicka till syslog (används av både flow och testknapp)
  async sendToSyslog(data) {
    const host = this.homey.settings.get('syslogHost');
    const port = parseInt(this.homey.settings.get('syslogPort')) || 514;

    if (!host) {
      throw new Error('IP address not configured');
    }

    return new Promise((resolve, reject) => {
      const client = dgram.createSocket('udp4');
      const facility = 1;
      const severity = parseInt(data.severity) || 6;
      const pri = (facility * 8) + severity;
      const timestamp = new Date().toISOString();
      
      const rawMessage = `<${pri}>${timestamp} ${data.hostname || 'HomeyPro'} ${data.tag || 'Homey'}: ${data.message}`;
      const payload = Buffer.from(rawMessage);

      client.send(payload, port, host, (err) => {
        client.close();
        if (err) return reject(err);
        resolve(true);
      });
    });
  }
}

module.exports = SyslogApp;