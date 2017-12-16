import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

export interface ProductInfoModel {
  product:Object;
}

@Component({
  selector: 'app-one-prod-modal',
  templateUrl: './one-prod-modal.component.html',
  styleUrls: ['./one-prod-modal.component.css']
})
export class OneProdModalComponent extends DialogComponent<ProductInfoModel, String> implements OnInit, ProductInfoModel {

  product: Object;

  imageURLArr: Array<String> = [];

  currPic:number = 0;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  ngOnInit() {
    console.log("IN ONEPROD INIT");
    console.log(this.product);

    // prep imageURLs
    var tempArr: Array<String> = this.product["imageURLs"].split("@");
    tempArr.shift(); // Remove the "" value in the 0th spot
    this.imageURLArr = tempArr;

    // Prep product information
    var prodHTML: string = ``;
    var keyHTML: string = ``;

    var noGos: Array<string> = ["Battery Life_F", "Depth_F", "Hard Drive Capacity_F", "Height_F", "Price_F", 
      "Processor Speed_F", "Screen Size_F", "Short-Description", "System Memory(RAM)_F", "Weight_F", "Width_F",
      "close1", "close2", "close3", "close4", "close5", "close6", "close7", "close8", "color", "imageURLs",
      "_id", "_imageURLs", "_rev", "Product Name"];  // Note the short-Des and Product Name are special cases b/c used directly
    var keyAttrs: Array<string>= ["Hard Drive Capacity", "Hard Drive Type", "Operating System", "Price", "Processor Speed",
      "Screen Size", "System Memory(RAM)"];

    for (var key in this.product) {
      // skip loop if the property is from prototype
      if (!this.product.hasOwnProperty(key) || noGos.lastIndexOf(key)!==-1) continue;
      
      var obj = this.product[key];

      if(keyAttrs.lastIndexOf(key)===-1){
        prodHTML += `<li class="prodElem"> ${key} : ${obj} </li>`;        
      }else{
        keyHTML += `<li class="prodElem"> ${key} : ${obj} </li>`;
      }
    }

    document.getElementById("keyPoint").innerHTML = keyHTML;
    document.getElementById("insertionPoint").innerHTML = prodHTML;
  }


  leftArrow(){
    if(this.currPic > 0){
      this.currPic -= 1;
    }
  }


  rightArrow(){
    if(this.currPic < this.imageURLArr.length-1){
      this.currPic += 1;
    }
  }

}
