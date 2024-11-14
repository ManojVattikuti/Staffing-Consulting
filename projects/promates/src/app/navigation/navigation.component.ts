import { Component, inject,ViewChild } from '@angular/core';
import { MenuService } from '../menu.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'; // {{ edit_1 }}
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

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
  @ViewChild('headerDropdown', { static: false }) headerDropdown!: NgbDropdown;
  navigateToAbout(): void {
    this.route.navigate(['/about']);
  }
  navigateToChild(path: string,headerDropdown?:any): void { // {{ edit_1 }}
    if(this.headerDropdown?.isOpen()){
      this.headerDropdown.close();
    }
    if(headerDropdown?.isOpen()){
      headerDropdown.close();
    }
    this.route.navigate([path]); // Navigate to the child path
  }
  constructor() {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuData();
  }

  subItemSelection(tab:any,subItem?:any){
     if(tab && tab?.subnav?.length){
      if(!tab.selectedSubNav){
        tab.selectedSubNav ={};
      }
      tab.selectedSubNav = {};
      if(!subItem && tab.subnav[0]?.subchildren){
        tab.selectedSubNav = tab.subnav[0];
      }else if(subItem && subItem?.subchildren){
        tab.selectedSubNav = subItem;
      }
     }
  }


}
