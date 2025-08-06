import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@website-front/components/footer/footer.component';
import { HeaderComponent } from '@website-front/components/header/header.component';

@Component({
  selector: 'app-layouts',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './website-front-layouts.component.html'
})
export class WebsiteFrontLayoutsComponent {

}
