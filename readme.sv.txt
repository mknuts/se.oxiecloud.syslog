Syslog på ett enkelt sätt

Vill du bara ha enklast möjliga syslog klient för Homey?
Då är det här appen för dig, bara ett enda flödeskort som kan skicka syslog-meddelanden till valfri syslog-server.
Stödjer både UDP (resurssnålt) och TCP (säkrare överföring).
För att spara resurser så loggar appen ingenting till din Homey utan skickar allt direkt till din syslog server.
Fungerar utmärkt tillsammans med Log Central i Synology NAS.

Efter att appen har installerats, gå till appens inställningar och fyll i IP-adress, port och protokoll till din syslog-server.
"Meddelande" är den enda obligatoriska parametern på flödeskortet, alla andra har standardvärden vilket gör det möjligt att lägga till loggning i dina flöden med minimal ansträngning.