import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { BodyComponent } from "../body/body.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, BodyComponent, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
