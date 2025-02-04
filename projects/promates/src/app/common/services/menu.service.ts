import { Injectable } from '@angular/core';
import { MENU_DATA } from '../constants/menu.constants';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() {}

  getMenuData() {
    return MENU_DATA; // Return the imported menu data
  }
  
}
