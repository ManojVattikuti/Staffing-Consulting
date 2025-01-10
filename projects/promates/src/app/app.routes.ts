import { Routes } from '@angular/router';
import { APP_PATHS } from './common/constants/app.constants';
import { HomeComponent } from './app-home/home.component';
import { AboutusComponent } from './features/Aboutus/aboutus.component';
import { ContactUsComponent } from './features/Contactus/contact-us.component';
import { StaffingComponent } from './features/Products/staffing/staffing.component';
import { ConsultingComponent } from './features/Products/consulting/consulting.component';
import { FinanceComponent } from './features/Industries/finance/finance.component';
import { HealthCareComponent } from './features/Industries/health-care/health-care.component';
import { InformationTechnologyComponent } from './features/Industries/information-technology/information-technology.component';
import { RetailComponent } from './features/Industries/retail/retail.component';
import { LifeSciencesComponent } from './features/Industries/life-sciences/life-sciences.component';
import { LogisticsComponent } from './features/Industries/logistics/logistics.component';
import { SearchJobsComponent } from './features/Searchjobs/search-jobs.component';
import { SubmitResumeComponent } from './features/Submitresume/submit-resume.component';
import { LoginComponent } from './features/Login/login.component';
import { SignUpComponent } from './features/Signup/sign-up.component';
import { PostJobsComponent } from './features/Postjobs/post-jobs.component';
import { CompaniesComponent } from './features/Companies/companies.component';

export const routes: Routes = [
  // { path: '', redirectTo: APP_PATHS.HOME, pathMatch: 'full' },
  { path: '', component: HomeComponent, canActivate: [] },
  { path: APP_PATHS.LOGIN, component: LoginComponent },
  { path: APP_PATHS.SIGN_UP, component: SignUpComponent },
  { path: APP_PATHS.ABOUT, component: AboutusComponent },
  { path: APP_PATHS.CONTACT, component: ContactUsComponent },
  { path: APP_PATHS.SERVICES.STAFFING, component: StaffingComponent },
  { path: APP_PATHS.SERVICES.CONSULTING, component: ConsultingComponent },
  { path: APP_PATHS.INDUSTRIES.FINANCE, component: FinanceComponent },
  { path: APP_PATHS.INDUSTRIES.HEALTH_CARE, component: HealthCareComponent },
  { path: APP_PATHS.INDUSTRIES.IT, component: InformationTechnologyComponent },
  { path: APP_PATHS.INDUSTRIES.RETAIL, component: RetailComponent },
  {
    path: APP_PATHS.INDUSTRIES.LIFE_SCIENCES,
    component: LifeSciencesComponent,
  },
  { path: APP_PATHS.INDUSTRIES.LOGISTICS, component: LogisticsComponent },
  { path: APP_PATHS.JOB_SEEKER.SEARCH_JOBS, component: SearchJobsComponent },
  {
    path: APP_PATHS.JOB_SEEKER.SUBMIT_RESUME,
    component: SubmitResumeComponent,
  },
  { path: APP_PATHS.POST_JOBS, component: PostJobsComponent },
  { path: APP_PATHS.COMPANIES, component: CompaniesComponent },
];
