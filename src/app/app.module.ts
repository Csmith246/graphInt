import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

//Components
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CanvasComponent } from './canvas/canvas.component';

//Services
import { ProductsService } from './services/products.service';
import { AxesService } from './services/axes.service';

const appRoutes :Routes = [
  {path : '', component : LandingPageComponent},
  {path : 'main-page', component : MainPageComponent}
  
  //,
  //{path : '**', component : '404PageComponent'}
];

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    LandingPageComponent,
    MainPageComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule
  ],
  providers: [
    ProductsService,
    AxesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
