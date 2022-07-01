export interface IHeartBeat {
    timestamp: number;
    topics: string;
    serial: string;
    message: Message;
}
export interface Message {
    source: SourceOrKey;
    key: SourceOrKey;
    data: Data;
}
export interface SourceOrKey {
}
export interface Data {
    "Monitoring.Load1": number;
    "Monitoring.Procs": number;
    "Monitoring.Ram": number;
    "Monitoring.Swap": number;
    "Monitoring.Uptime": number;
    "Properties.Firmware.Version": string;
    "Topics":string;
    "Applications":string;
}

export interface IHeartBeatAppMessage {
    applications: IHeartBeatAppMessageArray
    status: IHeartBeatAppMessageArray
}
export interface IHeartBeatAppMessageArray{
    array:(string)[]
}
  