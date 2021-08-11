// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
  abonnementUrl: 'https://paardrijvakantie.com/randmeren/API/getAboListPerYear.php?year=',
  saveVisitUrl: 'https://paardrijvakantie.com/randmeren/API/addAboDate.php',
  bootAbonnementUrl: 'https://paardrijvakantie.com/randmeren/API/getRevenuAboPerYear.php?year=',
  botterListUrl: 'https://paardrijvakantie.com/randmeren/API/getBotterListPerYear.php?year=',
  botterVisitsUrl: 'https://paardrijvakantie.com/randmeren/API/getBotterVisitsPerYear.php?year=',
  botterVisitAddUrl: 'https://paardrijvakantie.com/randmeren/API/addBotterVisit.php',
  botterVisitUpdateUrl: 'https://paardrijvakantie.com/randmeren/API/updateBotterVisit.php'

};