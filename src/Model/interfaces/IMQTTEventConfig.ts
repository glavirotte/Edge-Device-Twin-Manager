import { Data } from "./IResponse";

export interface IMQTTEventConfig extends Data{
    eventPublicationConfig: EventPublicationConfig;
  }
  export interface EventPublicationConfig {
    topicPrefix: string;
    customTopicPrefix: string;
    appendEventTopic: boolean;
    includeTopicNamespaces: boolean;
    includeSerialNumberInPayload: boolean;
    eventFilterList?: (EventFilterListEntity)[] | null;
  }
  export interface EventFilterListEntity {
    topicFilter: string;
    qos: number;
    retain: string;
  }
  