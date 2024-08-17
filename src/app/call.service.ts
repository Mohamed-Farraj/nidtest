import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  constructor(private _HttpClient:HttpClient ) { }

  resutl:any;

  callidapi(id:string):Observable<any>
  {
     return this._HttpClient.get(`https://reqres.in/api/users/${id}`)
  }
}
