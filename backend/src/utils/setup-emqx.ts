import { ConfigModule, ConfigService } from '@nestjs/config';
import { color } from 'console-log-colors';
import * as mqtt from 'mqtt';

ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});
const configService = new ConfigService();

global.mqttClient = null;

function startMqttClient() {
  const options: mqtt.IClientOptions = {
    port: 1883,
    host: configService.get('EMQX_HOST'),
    clientId:
      'webhook_superuser' + Math.round(Math.random() * (0 - 10000) * -1),
    username: configService.get('EMQX_NODE_SUPERUSER_USER'),
    password: configService.get('EMQX_NODE_SUPERUSER_PASSWORD'),
    keepalive: 60,
    reconnectPeriod: 5000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8',
  };

  global.mqttClient = mqtt.connect(
    `mqtt://${configService.get('EMQX_HOST')}`,
    options,
  );

  global.mqttClient.on('connect', () => {
    console.log('\n');
    console.log(color.green('✅ MQTT CONNECTION -> SUCCESS ✅'));
    console.log('\n');
  });

  global.mqttClient.on('reconnect', () => {
    console.log('RECONNECTING MQTT');
  });

  global.mqttClient.on('error', (error: any) => {
    console.log('MQTT CONNECIONT FAIL -> ');
    console.log(error);
  });
}

export { startMqttClient };
