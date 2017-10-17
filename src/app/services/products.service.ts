import { Injectable } from '@angular/core';
import PouchDB from "pouchdb";
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { data } from '../models/data';


@Injectable()
export class ProductsService {

  productArray;  

  subject = new Rx.Subject();

  constructor() {
  }
  
  getFromDB(){
    var db = new PouchDB('http://localhost:5984/laptopdataresampled');///testdataforgraphint

    return Rx.Observable.fromPromise(db.allDocs({
      include_docs: true
    }));

  }

  getComm(){
    return this.subject;
  }

  updateAttrs(name:string){
    this.subject.next(name);
  }

}