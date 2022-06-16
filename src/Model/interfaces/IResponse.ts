/*#######################################################  

These interface describes the format of the response sent
back by the device. It is used to access field of the JSON
object.

#########################################################*/

export interface IResponse {
    apiVersion?: string;
    data?: Data;
    reply?: Reply;
    method: string;
    context?:string
  }
  export interface Data {
    status: any
    propertyList: PropertyList
    activeFirmwareVersion: string
    activeFirmwarePart: string
    inactiveFirmwareVersion: string
    isCommitted: boolean
    lastUpgradeAt: string
  }
  export interface PropertyList {
    Architecture: string;
    ProdNbr: string;
    HardwareID: string;
    Version: string;
    ProdFullName: string;
    Brand: string;
    ProdType: string;
    Soc: string;
    SocSerialNumber: string;
    WebURL: string;
    ProdVariant: string;
    SerialNumber: string;
    ProdShortName: string;
    BuildDate: string;
  }
  export interface Reply {
    $: $;
    application?: (ApplicationEntity)[] | null;
  }
  export interface $ {
    result: string;
  }
  export interface ApplicationEntity {
    $: ApplicationProperties;
  }
  export interface ApplicationProperties {
    Name: string;
    NiceName: string;
    Vendor: string;
    Version: string;
    ApplicationID: string;
    License: string;
    Status: string;
    ConfigurationPage: string;
    VendorHomePage: string;
    LicenseName: string;
  }
  