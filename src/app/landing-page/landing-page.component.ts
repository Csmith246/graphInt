import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AxesService } from '../services/axes.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(
    public axs:AxesService,
    public router:Router
  ) { }

  ngOnInit() {
  }

  setAxes(myForm){
    console.log(myForm.value["x-axis"]);
    console.log(myForm.value["y-axis"]);
    if(myForm.value["x-axis"] === null || myForm.value["y-axis"] === null){
      // Do nothing
    }else{
      this.axs.setAxes({
        "x-axis": myForm.value["x-axis"],
        "y-axis": myForm.value["y-axis"]
        });
      this.router.navigate(["/main-page"]);
    }
  }

}
