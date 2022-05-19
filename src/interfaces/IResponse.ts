/*#######################################################  

These interface describes the format of the response sent
back by the device. It is used to access field of the JSON
object.

#########################################################*/

export interface IResponse {
    reply: Reply;
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