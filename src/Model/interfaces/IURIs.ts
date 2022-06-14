export interface IURIs {
    morphean: Morphean;
    axis: Axis;
  }
  export interface Morphean {
    proxyurl: string;
  }
  export interface Axis {
    list: string;
    upload: string;
    control: string;
    basicdeviceinfo: string;
    lightcontrol: string;
    firmware: string;
    mqtt: string;
    ping: string;
  }