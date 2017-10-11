import { Injectable } from '@angular/core';

@Injectable()
export class AxesService {

  updated:Boolean = false;

  Axes = {
    'x-axis': null,
    'y-axis': null
}


  constructor() { }

  getAxes(){
    return this.Axes;
  }

  setAxes(vals:Object){
    this.Axes["x-axis"] = vals["x-axis"];
    this.Axes["y-axis"] = vals["y-axis"];
  }

  isUpdated(val:Boolean){
    this.updated = val;
  }

  getUpdated(){
    return this.updated;
  }

}
