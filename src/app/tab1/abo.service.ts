import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Abonnement} from '../model/Abonnement';
import { Result } from '../model/result';

@Injectable()
export class AboService {

  constructor(private http: HttpClient) {
  }

  /**
   * Get a list of all subcriptions
   */
  getAllSubscriptions(year: number): Observable<Abonnement[]> {
    return this.http.get<Abonnement[]>(environment.abonnementUrl + year);
  }

  /**
   * Register a visit
   */
  saveVisit(eilandBezoek): Observable<Result> {
    return this.http.post<Result>(environment.saveVisitUrl, eilandBezoek);
  }
} 
