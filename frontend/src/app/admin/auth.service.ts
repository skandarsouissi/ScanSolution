import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const BaseUrl = 'http://localhost:8080/';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  signup(AuthRequest:any):Observable<any> {
    return this.http.post(BaseUrl + "api/auth/signup", AuthRequest);
  }
}

