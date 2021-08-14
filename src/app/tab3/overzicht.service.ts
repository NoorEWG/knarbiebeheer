import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RevenuAbo } from '../model/revenu-abo';


@Injectable()
export class OverzichtService {

  constructor(private http: HttpClient) {
  }

  /**
   * Get a list of boots with the annual revenu plus the totals for a specific year
   */
  getAllSubscriptionsPerBoat(year: number): Observable<RevenuAbo> {
    return this.http.get<RevenuAbo>(environment.bootAbonnementUrl + year);
  }

  /**
   * Get a list of boots with the annual revenu plus the totals for a specific year
   */
   getAllSubscriptionsPerDay(year: number): Observable<RevenuAbo> {
    return this.http.get<RevenuAbo>(environment.bootAbonnementVisitUrl + year);
  }

   
} 
