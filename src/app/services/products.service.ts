import { Injectable } from '@angular/core';
import PouchDB from "pouchdb";
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { data } from '../models/data';
import mysql from "mysql";


@Injectable()
export class ProductsService {

  productArray;  

  subject = new Rx.Subject();

  constructor() {
  }
  
  getFromDB(){
    // Local CouchDB query with PouchDB
    var db = new PouchDB('http://localhost:5984/laptopdataresampled');///testdataforgraphint

    return Rx.Observable.fromPromise(db.allDocs({
      include_docs: true
    }));

    // var con = mysql.createConnection({
    //   host: "db709367956.db.1and1.com",
    //   user: "dbo709367956",
    //   password: "Chip-i-ty1"
    // });
    
    // con.connect(function(err) {
    //   if (err) throw err;
    //   console.log("Connected!");
    // });
    

    // return new Rx.Observable();

  }

  getComm(){
    return this.subject;
  }

  updateAttrs(name:string){
    this.subject.next(name);
  }

}