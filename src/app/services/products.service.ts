import { Injectable } from '@angular/core';
import PouchDB from "pouchdb";
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { data } from '../models/data';


@Injectable()
export class ProductsService {

  productArray;  

  constructor() {
  }

  
  getFromDB(){
    var db = new PouchDB('http://localhost:5984/laptopdataresampled');
    
    // var prepProducts = function(data){
    //   console.log("HERE");
    //   var tempArray = [];
    //   for(var i=0; i<data.rows.length; i++){
    //     tempArray.push(data.rows[i].doc);
    //   }
    //   console.log(tempArray);
    //   ProductsService.productArray = tempArray;
    //   return tempArray;
    //   //console.log(this.productArray);
    // }

    return Rx.Observable.fromPromise(db.allDocs({
      include_docs: true
    }));

    // db.allDocs({
    //     include_docs: true
    //   }).then(function (result) {
    //     console.log('done');
    //     console.log(result);

    //     //this.productArray = 
    //     return(prepProducts(result));
    //   }).catch(function (err) {
    //     console.log(err);
    //   });
  }

}