'use strict';

const Homey = require('homey');
const dgram = require('dgram');
const net = require('net');

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
  async sendToSyslog({ message, severity, tag, hostname }) {
    const host = this.homey.settings.get('syslogHost');
    const port = parseInt(this.homey.settings.get('syslogPort') || 514);
    const protocol = this.homey.settings.get('syslogProtocol') || 'udp';

    if (!host) {
      throw new Error('IP address not configured');
    }


    const syslogMsg = `<${severity}>${new Date().toISOString()} ${hostname} ${tag}: ${message}`;

    if (protocol === 'tcp') {
      return new Promise((resolve, reject) => {
        const client = net.connect({ host, port }, () => {
          client.end(syslogMsg + '\n'); // TCP kräver ofta en newline
          resolve();
        });
        client.on('error', reject);
        client.setTimeout(3000, () => { client.destroy(); reject(new Error('TCP Timeout')); });
      });
    } else {
      // Din befintliga UDP-logik här
      const client = dgram.createSocket('udp4');
      const buffer = Buffer.from(syslogMsg);
      client.send(buffer, 0, buffer.length, port, host, (err) => {
        client.close();
        if (err) throw err;
      });
    }
  }
}

module.exports = SyslogApp;