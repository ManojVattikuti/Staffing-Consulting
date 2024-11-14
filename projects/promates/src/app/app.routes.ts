import { Routes } from '@angular/router';
import { APP_PATHS, AppConstants } from './constants/app.constants';
import { HomeComponent } from './home/home.component';
import { MENU_DATA } from './constants/menu.constants';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { StaffingComponent } from './staffing/staffing.component';
import { ConsultingComponent } from './consulting/consulting.component';
import { FinanceComponent } from './finance/finance.component';
import { HealthCareComponent } from './health-care/health-care.component';
import { InformationTechnologyComponent } from './information-technology/information-technology.component';
import { RetailComponent } from './retail/retail.component';
import { LifeSciencesComponent } from './life-sciences/life-sciences.component';
import { LogisticsComponent } from './logistics/logistics.component';
import { SearchJobsComponent } from './search-jobs/search-jobs.component';
import { SubmitResumeComponent } from './submit-resume/submit-resume.component';

// const menuRoutes = MENU_DATA.map(item => ({
//     path: 'item.path',
//     loadChildren: () => import(`./${item.id}/${item.id}.component`).then(m => m[item.id.charAt(0).toUpperCase() + item.id.slice(1) + 'Component']),
// }));

export const routes: Routes = [
    // { path: '', redirectTo: APP_PATHS.HOME, pathMatch: 'full' },
    { path: '', component: HomeComponent, canActivate: [] },
    // ...menuRoutes,
    { path: APP_PATHS.ABOUT, component:AboutusComponent},
    { path: APP_PATHS.CONTACT, component: ContactUsComponent },
    { path: APP_PATHS.SERVICES.STAFFING, component: StaffingComponent },
    { path: APP_PATHS.SERVICES.CONSULTING, component: ConsultingComponent },
    { path: APP_PATHS.INDUSTRIES.FINANCE, component: FinanceComponent },
    { path: APP_PATHS.INDUSTRIES.HEALTH_CARE, component: HealthCareComponent },
    { path: APP_PATHS.INDUSTRIES.IT, component: InformationTechnologyComponent },
    { path: APP_PATHS.INDUSTRIES.RETAIL, component: RetailComponent },
    { path: APP_PATHS.INDUSTRIES.LIFE_SCIENCES, component: LifeSciencesComponent },
    { path: APP_PATHS.INDUSTRIES.LOGISTICS, component: LogisticsComponent },
    { path: APP_PATHS.JOB_SEEKER.SEARCH_JOBS, component: SearchJobsComponent },
    { path: APP_PATHS.JOB_SEEKER.SUBMIT_RESUME, component: SubmitResumeComponent },

];
