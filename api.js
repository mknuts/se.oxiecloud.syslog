'use strict';

module.exports = {
  /**
   * testConnection is called from the settings page.
   * We use 'homey.app' to access the methods in your SyslogApp class (app.js).
   */
  async testConnection({ homey, body }) {
    // We send a test message to verify the connection
    try {
      await homey.app.sendToSyslog({
        message: 'Test message from Homey settings page',
        severity: '6',
        tag: 'Test',
        hostname: 'Homey'
      });
      
      // We return something to the HTML page so it knows everything went well
      return { status: 'ok' };
    } catch (error) {
      // If something goes wrong (e.g. no IP configured), we pass the error along
      throw new Error(error.message || 'Failed to send test message');
    }
  },
};