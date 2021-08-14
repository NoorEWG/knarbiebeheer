import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Botter } from '../model/botter';
import { BotterVisitTotal } from '../model/botter-visit-total';
import { Result } from '../model/result';
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
   getBotterVisits(year: number): Observable<BotterVisitTotal> {
    return this.http.get<BotterVisitTotal>(environment.botterVisitsUrl + year);
  }

  /**
   * Add a visit of a botter
   */
   addBotterVisit(botterBezoek): Observable<Result> {
    return this.http.post<Result>(environment.botterVisitAddUrl, botterBezoek);
  }

  /**
   * Update a visit of a botter
   */
   updateBotterVisit(updateBotterBezoek): Observable<Result> {
    console.log(JSON.stringify(updateBotterBezoek));
    return this.http.post<Result>(environment.botterVisitUpdateUrl, updateBotterBezoek);
  }


   
} 
