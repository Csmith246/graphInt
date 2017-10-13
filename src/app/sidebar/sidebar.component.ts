import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AxesService } from '../services/axes.service';
import { ProductsService } from '../services/products.service';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    public ps:ProductsService,
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
      //this.router.navigate(["/main-page"]);
      this.axs.isUpdated(true);
    }

    // Let Service know that attributes have been updated
    this.ps.updateAttrs("sidebar update");
  }

  isSelected(){
    return "selected";
  }

}
