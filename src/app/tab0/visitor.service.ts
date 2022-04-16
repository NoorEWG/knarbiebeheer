import { IslandVisitor } from './../model/island-visitor';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Result } from '../model/result';

@Injectable()
export class VisitorService {

  constructor(private http: HttpClient) {
  }

  /**
   * Register a visit of a visitor without a subscription
   */
  saveVisit(eilandBezoek: IslandVisitor): Observable<Result> {
    // console.log(JSON.stringify(eilandBezoek));
    return this.http.post<Result>(environment.saveVisitWithoutAboUrl, eilandBezoek);
  }

} 