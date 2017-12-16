import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { OneProdModalComponent } from '../one-prod-modal/one-prod-modal.component';

export interface ConfirmModel {
  title:string;
  message:string;
  productList:Array<Object>;
}

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent extends DialogComponent<ConfirmModel, Array<String>> implements OnInit, ConfirmModel  {

  title: string;
  message: string;
  productList: Array<Object>;



  constructor(dialogService: DialogService) {
    super(dialogService);
    console.log(this.productList); //this isn't defined, the one below is
  }

  isValGood(val){
    return val !== '?' ? true : false;
  }

  confirm(myForm) {
    console.log(this.productList);
    this.result = [myForm.value["x-axis"], myForm.value["y-axis"]];
  //   console.log(this.result);
  //  // this.result = [];

  //   console.log(myForm.value["x-axis"]);
  //   console.log(myForm.value["y-axis"]);
  //   if(myForm.value["x-axis"] === null || myForm.value["y-axis"] === null){
  //     // Do nothing
  //   }else{
      
  //   }

    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 

    this.close();
  }

  ngOnInit() {
    console.log('IN on init');
    console.log(this.productList);
  }

  openProdPage(product){
    console.log(product);
    let disposable = this.dialogService.addDialog(OneProdModalComponent, { product:product })
  }

}
