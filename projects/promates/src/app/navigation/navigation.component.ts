import { Component, inject } from '@angular/core';
import { MenuService } from '../menu.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'; // {{ edit_1 }}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  menuItems: any[] = [];
  public route = inject(Router);
  private menuService= inject(MenuService);
  
  navigateToAbout(): void {
    this.route.navigate(['/about']);
  }
  navigateToChild(path: string): void { // {{ edit_1 }}
    this.route.navigate([path]); // Navigate to the child path
  }
  constructor() {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuData();
  }

  subItemSelection(tab:any,subItem?:any){
    this.menuItems.map((a:any)=>{ a.selected = false})
    tab.selected = true;
     if(tab && tab?.subnav?.length){
      if(!tab.selectedSubNav){
        tab.selectedSubNav ={};
      }
      tab.selectedSubNav = {};
      if(!subItem){
        tab.selectedSubNav = tab.subnav[0];
      }else if(subItem){
        tab.selectedSubNav = subItem;
      }
     }
  }


}
