import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RestProvider {

apiUrlFMPI = 'http://fmpi.fotonphils.net:3100';
apiUrlHBD = 'http://annex.fotonphils.net:3100';
tokenFMPI: any;
tokenHBD: any;

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
    this.tokenFMPI ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoicG9zdGdyZXMifQ.KBudNFe-H-ZBNkrf4nyyIl1RrU_UH3WRhkE0kAu8dc8";
    this.tokenHBD ="";
  }

  getLocations() {
    return new Promise(resolve => {
      this.http.get(this.apiUrlFMPI+'/fu_scanner_locations').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  scanFMPI(data) {
    let h = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer '+this.tokenFMPI
    });
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrlFMPI+'/fu_scanned', JSON.stringify(data), {headers: h
        //headers: new HttpHeaders().set('Authorization', 'Bearer '+this.token),
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  scanHBD(data) {
    let h = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer '+this.tokenFMPI
    });
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrlHBD+'/fu_scanned', JSON.stringify(data), {headers: h
        //headers: new HttpHeaders().set('Authorization', 'Bearer '+this.token),
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  addInventory(inv) {
    let h = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer '+this.tokenFMPI
    });
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrlFMPI+'/fu_scanner_inventory', JSON.stringify(inv), {headers: h
        //headers: new HttpHeaders().set('Authorization', 'Bearer '+this.token),
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}
