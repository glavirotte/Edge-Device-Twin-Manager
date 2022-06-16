import { Data } from "./IResponse";

  export interface IMQTTClientStatus extends Data{
    status: Status;
    config: Config;
  }
  export interface Status {
    state: string;
    connectionStatus: string;
  }
  export interface Config {
    activateOnReboot: boolean;
    server: Server;
    username: string;
    password: string;
    clientId: string;
    keepAliveInterval: number;
    connectTimeout: number;
    cleanSession: boolean;
    autoReconnect: boolean;
    lastWillTestament: LastWillTestamentOrConnectMessageOrDisconnectMessage;
    connectMessage: LastWillTestamentOrConnectMessageOrDisconnectMessage;
    disconnectMessage: LastWillTestamentOrConnectMessageOrDisconnectMessage;
    ssl: Ssl;
  }
  export interface Server {
    protocol: string;
    host: string;
    port: number;
    basepath: string;
  }
  export interface LastWillTestamentOrConnectMessageOrDisconnectMessage {
    useDefault: boolean;
    topic: string;
    message: string;
    retain: boolean;
    qos: number;
  }
  export interface Ssl {
    validateServerCert: boolean;
  }
