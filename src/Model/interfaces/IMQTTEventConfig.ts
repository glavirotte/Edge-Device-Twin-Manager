import { ICommon } from "./ICommon";
import { Data } from "./IResponse";

export interface IMQTTEventConfig extends Data{
    eventPublicationConfig: EventPublicationConfig;
  }
  export interface EventPublicationConfig {
    common:ICommon
    eventFilterList?: (EventFilterListEntity)[] | null;
  }
  export interface EventFilterListEntity {
    topicFilter: string;
    qos: number;
    retain: string;
  }
  