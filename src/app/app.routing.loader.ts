import {PreloadingStrategy, Route} from '@angular/router';

// import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {Observable, of} from 'rxjs';

export class AppCustomPreload implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    return route.data && route.data['preload'] ? load() : of(null);
  }
}