export class IInstanceModel {
  public publicDns: string;
  public privateIp: string;
  public publicIp: string;
  public launchTime: string;
  public instanceId: string;
  public isManager: boolean;
  public services: string[];
  public availability: string;
  public constructor(publicDns: string, privateIp: string, publicIp: string, launchTime: string, instanceId: string) {
    this.publicDns = publicDns;
    this.privateIp = privateIp;
    this.publicIp = publicIp;
    this.launchTime = launchTime;
    this.instanceId = instanceId;
    this.services = [];
    this.availability = 'Active';
  }
}
