
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class SwarmService {

  constructor(private http: HttpClient) {

  }

  public getInstances(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/instances', httpOptions)
      .pipe(
        tap(() => {}),
      );
  }

  public checkIfSwarm(publicDns: string): Observable<any[]> {
    return this.http.post<any[]>('http://localhost:3000/api/idSwarm', {publicDns}, httpOptions).pipe(
      tap(() => {}),
    );
  }

  public getServices(publicDns: string): Observable<any[]> {
    return this.http.post<any[]>('http://localhost:3000/api/getServices', {publicDns}, httpOptions).pipe(
      tap(() => {}),
    );
  }

  public createSwarm(publicDns: string): Observable<any[]> {
    return this.http.post<any[]>('http://localhost:3000/api/create', {publicDns}, httpOptions).pipe(
      tap(() => {}),
    );
  }

  public deleteSwarm(publicDns: string): Observable<any[]> {
    return this.http.post<any[]>('http://localhost:3000/api/deleteSwarm', {publicDns}, httpOptions).pipe(
      tap(() => {}),
    );
  }


  public drainNode(publicDns: string, ipAddress: string) {
    return this.http.post<any[]>('http://localhost:3000/api/drain', {publicDns, ipAddress}, httpOptions).pipe(
      tap(() => {}),
    );
  }

  public makeAvailable(publicDns: string, ipAddress: string) {
    return this.http.post<any[]>('http://localhost:3000/api/makeAvailable', {publicDns, ipAddress}, httpOptions).pipe(
      tap(() => {}),
    );
  }

  public leaveSwarm(publicDns: string): Observable<any[]> {
    return this.http.post<any[]>('http://localhost:3000/api/leaveSwarm', {publicDns}, httpOptions).pipe(
      tap(() => {}),
    );
  }

  public scaleService(publicDns: string): Observable<any[]> {
    return this.http.post<any[]>('http://localhost:3000/api/scaleService', {publicDns}, httpOptions).pipe(
      tap(() => {}),
    );
  }

  public removeServices(publicDns: string): Observable<any[]> {
    return this.http.post<any[]>('http://localhost:3000/api/removeServices', {publicDns}, httpOptions).pipe(
      tap(() => {}),
    );
  }

  public removeFromSwarm(publicDns: string, ipAddress: string) {
    return this.http.post<any[]>('http://localhost:3000/api/removeFromSwarm', {publicDns, ipAddress}, httpOptions).pipe(
      tap(() => {}),
    );
  }

  public joinSwarm(publicDns: string, joinCommand: string): Observable<any[]> {
    console.log(joinCommand);
    if(!joinCommand) {
      joinCommand = localStorage.getItem('joinSwarm');
      console.log(joinCommand);
    }
    return this.http.post<any[]>('http://localhost:3000/api/joinSwarm', {publicDns, joinCommand}, httpOptions).pipe(
      tap(() => {}),
    );
  }
}
