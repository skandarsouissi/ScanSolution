import { Injectable } from '@angular/core';
const TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  static setToken(token: string): void {
    window.localStorage.setItem(TOKEN, token);
    window.localStorage.removeItem(TOKEN);

  }
  static getToken(): string {
  // This method should retrieve the token from storage (e.g., localStorage or sessionStorage)
  return localStorage.getItem('TOKEN') || '';
}
}
