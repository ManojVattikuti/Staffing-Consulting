import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '../menu.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'; // {{ edit_1 }}
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@promates.environments/environment';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule,TranslateModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  menuItems: any[] = [];
  subscription:Subscription = new Subscription();
  public route = inject(Router);
  private menuService = inject(MenuService);
  @ViewChild('headerDropdown', { static: false }) headerDropdown!: NgbDropdown;
  constructor(private authService: AuthService,
    public translate: TranslateService) {
  }
  navigateToAbout(): void {
    this.route.navigate(['/about'], { skipLocationChange: environment.ENABLE_SKIP_LOCATION });
  }
  navigateToChild(path: string, headerDropdown?: any): void { // {{ edit_1 }}
    if (this.headerDropdown?.isOpen()) {
      this.headerDropdown.close();
    }
    if (headerDropdown?.isOpen()) {
      headerDropdown.close();
    }
    this.route.navigate([path], { skipLocationChange: environment.ENABLE_SKIP_LOCATION }); // Navigate to the child path
  }

  isAuthenticated: boolean = false;
  role: string = '';
  ngOnInit(): void {
    let user = this.authService.getUserData();
    if(user && user.userData) {
      this.role = user.userData.role;
    }

    this.menuItems = this.menuService.getMenuData();
    this.subscription.add( this.authService.authenticated$.subscribe((authStatus: boolean) => {
      this.isAuthenticated = authStatus;
      let user = this.authService.getUserData();
      if(user && user.userData) {
        this.role = user.userData.role;
      }
      this.onUserLoggedIn(authStatus);
    }));
  }

  subItemSelection(tab: any, subItem?: any) {
    if (tab && tab?.subnav?.length) {
      if (!tab.selectedSubNav) {
        tab.selectedSubNav = {};
      }
      tab.selectedSubNav = {};
      if (!subItem && tab.subnav[0]?.subchildren) {
        tab.selectedSubNav = tab.subnav[0];
      } else if (subItem && subItem?.subchildren) {
        tab.selectedSubNav = subItem;
      }
    }
  }

  onUserLoggedIn(authStatus: any) {
    if (this.menuItems?.length) {
      this.menuItems.forEach((menuItem: any) => {
        this.setVisibility(menuItem, authStatus);

        if (menuItem?.subnav?.length) {
          menuItem.subnav.forEach((subNav: any) => {
            this.setVisibility(subNav, authStatus);

            if (subNav?.subchildren?.length) {
              subNav.subchildren.forEach((subChild: any) => {
                this.setVisibility(subChild, authStatus);
              });
            }
          });
        }
      });
    }

  }
  private setVisibility(item: any, authStatus: boolean): void {
    if (item.hasOwnProperty('visibleAfterLogin')) {
      item.visible = item.visibleAfterLogin === authStatus;
      if(item.permission && !item.permission.includes(this.role)) {
        item.visible = false;
      }
    } else {
      item.visible = true;
    }
  }

  ngOnDestry() {
    this.subscription.unsubscribe();
  }



}
