import { Component } from '@angular/core';
import {SwarmService} from './services/swarm.service';
import {IInstanceModel} from './instance.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  instances: IInstanceModel[];
  buttonsVisible: boolean = false;
  swarmCreated: boolean = false;
  dockerNodeLsTokens: string[] = [];
  dockerJoinCommand: string = '';
  serviceData: string[] = [];
  currentOperation: string = '';
  managerPublicDns: string = '';
  constructor(public swarmService: SwarmService) {
    this.getInstancesDetails();
  }

  getInstancesDetails() {
    this.currentOperation = 'getting instances\' details';
    this.buttonsVisible = false;
    this.swarmService.getInstances().subscribe((resp) => {
      this.instances = (resp as any).instances;
      for(let i = 0; i < this.instances.length; i++) {
        this.swarmService.checkIfSwarm(this.instances[i].publicDns).subscribe((resp) => {
          console.log(resp);
          if ((resp as any).response === 'not a manager') {
            this.instances[i].isManager = false;
            if (i === this.instances.length - 1 && !this.buttonsVisible) {
              this.currentOperation = '';
              this.buttonsVisible = true;
            }
          } else {
            this.instances[i].isManager = true;
            this.dockerNodeLsTokens = (resp as any).response;
            this.populateNodeData();
            this.swarmCreated = true;
            this.managerPublicDns = this.instances[i].publicDns;
            this.swarmService.getServices(this.instances[i].publicDns).subscribe((response) => {
              this.serviceData = (response as any).response;
              this.populateServiceData();
            });
          }
        })
      }
    });
  }

  isTheOnlyMember(privateIp: string) {
    for(const instance of this.instances) {
      for(let i = 0; i < this.dockerNodeLsTokens.length; i++) {
        if(this.dockerNodeLsTokens[i] === instance.privateIp) {
          if(this.dockerNodeLsTokens[i] !== privateIp) {
            return false;
          }
        }
      }
    }
    return true;
  }

  populateServiceData() {
    this.currentOperation = 'populating service data';
    if(this.serviceData.length > 0 && this.serviceData.length % 2 === 0) {
      for(const instance of this.instances) {
        instance.services = [];
        for(let i = 0; i < this.serviceData.length - 1; i++) {
          if(this.serviceData[i + 1] === instance.privateIp) {
            instance.services.push(this.serviceData[i]);
          }
        }
      }
    }
    this.currentOperation = '';
    this.buttonsVisible = true;
  }

  populateNodeData() {
    if(this.dockerNodeLsTokens.length > 0) {
      for(const instance of this.instances) {
        for(let i = 0; i < this.dockerNodeLsTokens.length - 2; i++) {
          if(this.dockerNodeLsTokens[i] === instance.privateIp) {
            instance.availability = this.dockerNodeLsTokens[i + 2];
          }
        }
      }
    }
    console.log(this.instances);
  }

  drainNode(privateIp: string) {
    this.buttonsVisible = false;
    this.currentOperation = 'draining node ' + privateIp;
    let formattedAddress: string = 'ip-' + privateIp.split('.').join('-');
    this.swarmService.drainNode(this.managerPublicDns, formattedAddress).subscribe(() => {
      setTimeout(()=>{
        this.getInstancesDetails();
      },2000);
    });
  }

  makeAvailable(privateIp: string) {
    this.buttonsVisible = false;
    this.currentOperation = 'making node available: ' + privateIp;
    let formattedAddress: string = 'ip-' + privateIp.split('.').join('-');
    this.swarmService.makeAvailable(this.managerPublicDns, formattedAddress).subscribe(() => {
      setTimeout(()=>{
        this.getInstancesDetails();
      },2000);
    });
  }

  deleteSwarm(publicDns: string) {
    this.buttonsVisible = false;
    this.managerPublicDns = '';
    this.currentOperation = 'deleting swarm';
    this.swarmService.deleteSwarm(publicDns).subscribe(() => {
      setTimeout(()=>{
        this.getInstancesDetails();
      },2000);
    });
  }

  scaleService(publicDns: string) {
    this.currentOperation = 'creating service replicas';
    this.buttonsVisible = false;
    this.swarmService.scaleService(publicDns).subscribe(() => {
      setTimeout(()=>{
        this.getInstancesDetails();
      },2000);
    });
  }

  removeServices(publicDns: string) {
    this.currentOperation = 'removing service replicas';
    this.buttonsVisible = false;
    this.swarmService.removeServices(publicDns).subscribe(() => {
      setTimeout(()=>{
        this.getInstancesDetails();
      },2000);
    });
  }

  isDown(ip: string) {
    const index = this.dockerNodeLsTokens.indexOf(ip);
    return this.dockerNodeLsTokens[index + 1] === 'Down';
  }

  removeFromSwarm(privateIp: string) {
    this.currentOperation = 'removing from swarm';
    this.buttonsVisible = false;
    let formattedAddress: string = 'ip-' + privateIp.split('.').join('-');
    this.swarmService.removeFromSwarm(this.managerPublicDns, formattedAddress).subscribe(() => {
      setTimeout(()=>{
        this.getInstancesDetails();
      },2000);
    });
  }

  leaveSwarm(publicDns: string) {
    this.currentOperation = 'leaving swarm';
    this.buttonsVisible = false;
    this.swarmService.leaveSwarm(publicDns).subscribe(() => {
      setTimeout(()=>{
        this.getInstancesDetails();
      },2000);
    });
  }

  joinSwarm(publicDns: string) {
    this.currentOperation = 'joining swarm';
    this.buttonsVisible = false;
    this.swarmService.joinSwarm(publicDns, this.dockerJoinCommand).subscribe(() => {
      setTimeout(()=>{
        this.getInstancesDetails();
      },2000);

    });
  }

  createSwarm(publicDns: string) {
    this.currentOperation = 'creating swarm';
    this.buttonsVisible = false;
    this.swarmService.createSwarm(publicDns).subscribe((resp) => {
      this.dockerJoinCommand = (resp as any).command;
      this.dockerJoinCommand = this.dockerJoinCommand.substring(0,this.dockerJoinCommand.indexOf('2377') + 4);
      localStorage.setItem('joinSwarm', this.dockerJoinCommand);
      this.getInstancesDetails();
    });
  }
}
