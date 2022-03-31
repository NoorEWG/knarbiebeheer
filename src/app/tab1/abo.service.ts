import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Abonnement } from '../model/Abonnement';
import { User } from '../model/user';
import { Boot } from '../model/boot';
import { UserBoot } from '../model/user-boot';
import { BootType } from '../model/boot-type';
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

  /**
   * Get all boats
   */
  getAllBoats(): Observable<Boot[]> {
    return this.http.get<Boot[]>(environment.botenLijstUrl);
  }

  /**
  * Get all boats
  */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.usersLijstUrl);
  }

  /**
  * Get all boatTypes
  */
  getAllBoatTypes(): Observable<BootType[]> {
    return this.http.get<BootType[]>(environment.botenTypesLijstUrl);
  }

  /**
  * Save or update user and / or boat data
  */
  save(userBoot: UserBoot): Observable<Result> {
    return this.http.post<Result>(environment.addOrUpdateUserBoatUrl, userBoot);
  }

  /**
  * Find current user by boatId
  */
  findUserByBoat(boot: Boot): Observable<Result> {
    return this.http.get<Result>(environment.getUserByBoatUrl + boot.id);
  }
  
  /**
  * Add abonnement next year
  */
  addAboNextYear(boatId: number, userId: number): Observable<Boolean> {
    return this.http.get<Boolean>(environment.addAboNextYearUrl + boatId + "&userId=" + userId);
  }
} 
