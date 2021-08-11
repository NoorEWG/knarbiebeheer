import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Botter } from '../model/botter';
import { BotterVisit } from '../model/botter-visit';

@Injectable()
export class BotterService {

  constructor(private http: HttpClient) {
  }

  /**
   * Get a list of all botters for a specific year
   */
  getBotterList(year: number): Observable<Botter> {
    return this.http.get<Botter>(environment.botterListUrl + year);
  }

  /**
   * Get a list of all botters visits for a specific year
   */
   getBotterVisits(year: number): Observable<BotterVisit> {
    return this.http.get<BotterVisit>(environment.botterVisitsUrl + year);
  }


   
} 
