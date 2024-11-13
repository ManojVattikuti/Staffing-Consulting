import { Routes } from '@angular/router';
import { APP_PATHS, AppConstants } from './constants/app.constants';
import { HomeComponent } from './home/home.component';
import { MENU_DATA } from './constants/menu.constants';
import { AboutusComponent } from './aboutus/aboutus.component';

// const menuRoutes = MENU_DATA.map(item => ({
//     path: 'item.path',
//     loadChildren: () => import(`./${item.id}/${item.id}.component`).then(m => m[item.id.charAt(0).toUpperCase() + item.id.slice(1) + 'Component']),
// }));

export const routes: Routes = [
    { path: '', redirectTo: APP_PATHS.HOME, pathMatch: 'full' },
    { path: APP_PATHS.HOME, component: HomeComponent, canActivate: [] },
    // ...menuRoutes,
    { path: APP_PATHS.ABOUT, component:AboutusComponent},
];
