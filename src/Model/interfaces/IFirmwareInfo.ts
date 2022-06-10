interface IFirmwareInfo {
    activeFirmwareVersion: string,
    activeFirmwarePart: string,
    inactiveFirmwareVersion: string,
    isCommitted: boolean,
    lastUpgradeAt: string
}
export {IFirmwareInfo}