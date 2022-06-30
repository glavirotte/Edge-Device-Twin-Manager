import { IApplication } from "../interfaces/IResponse"

class ApplicationTwinProperties implements IApplication{
    Name: string
    NiceName: string
    Vendor: string
    Version: string
    ApplicationID?: string
    License: string
    Status: string
    ConfigurationPage?: string
    VendorHomePage?: string
    LicenseName: string
    FileName?:string

    constructor(){
        this.Name = ""
        this.NiceName = ""
        this.Vendor = ""
        this.Version = ""
        this.ApplicationID = ""
        this.License = ""
        this.Status = ""
        this.ConfigurationPage = ""
        this.VendorHomePage = ""
        this.LicenseName = ""
        this.FileName = ""
    }
}

export { ApplicationTwinProperties } 