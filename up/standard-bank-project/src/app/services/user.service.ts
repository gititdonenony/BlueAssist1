import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { resolve } from 'url';
import { Storage } from '@ionic/storage';
import { GlobalService } from 'src/app/services/global.service';
import { NavController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js'  


@Injectable({
  providedIn: 'root'
})

export class UserService {


  _apiUrl:string="https://api.claimtec.co.za/v1/"
  server:string='https://api.claimtec.co.za/v1/auth/';
  _logoutUrl:string='https://api.claimtec.co.za/v1/account/logout';
 _driverslicencebarcodedecoderUrl:string='https://cors-anywhere.herokuapp.com/https://api.nptracker.co.za/NPS-DL/?scan=';
 _arNumber ='https://api.claimtec.co.za/v1/claim/';

//  _coverapi="https://cors-anywhere.herokuapp.com/https://casi-staging.liv.ninja/api/v1/";
 
  constructor(private http: HttpClient,
              private storage: Storage,
              private global: GlobalService,
              private navCtrl :NavController
    ) { }



  postRegister(body,file)
  {
    let headers=new HttpHeaders({
      'Content-Type':'application/json; charset-UTF-8'
    });
    let options = {
      headers:headers
    }
    var response =  this.http.post(this.server + file ,JSON.stringify(body),options)
    console.log(response);
    return response;
  }

  getLogin(body,file)
  {
    let headers=new HttpHeaders({
      'Content-Type':'application/json; charset-UTF-8',
      'Authorization': 'Basic ' + btoa(`${body.id_number}:${body.password}`)
    });
    let options = {
      headers:headers
    }
    // console.log(headers);
    var response =  this.http.get(this.server + file , options)
    console.log(response);
    return response; 
  }
  getVerify(body,file)
  {
    
    let headers=new HttpHeaders({
      'Content-Type':'application/json; charset-UTF-8'
    });
    let options = {
      headers:headers
    }
    
    var response =  this.http.post(this.server + file ,JSON.stringify(body),options)
    console.log(response);
    return response; 
  }

  LogOut()
  {
    var userData=this.storage.get('WbAuth').then((token)=>
    {
      console.log(token);

     let headers=new HttpHeaders({
      'Content-Type':'application/json; charset-UTF-8',
       'Authorization': `Bearer ${token}`})
    
     let options = {
       headers:headers
     }
     // console.log(headers);
     var response =  this.http.get(this._logoutUrl , options)
     console.log(response);
      
       response.subscribe((result:any)=>
        {
          console.log(result) 
           if(result.operation=='success')
           {
            this.storage.remove("WbAuth");
            this.global.toast('You have been logged out successfully.');
            this.navCtrl.navigateRoot(['/login']);
           }
        }) 

    });
    
  }
   InsurenceNotify(id,token,body)
  {
   
     let headers=new HttpHeaders({
       'Access-Control-Allow-Origin':'*',
      'Content-Type':'application/json',
       'Authorization': `Bearer ${token}`
      })
      console.log(token);

      console.log(headers);
    
     let options = {
       headers:headers
     }
     // console.log(headers);
      var response =  this.http.post(this._apiUrl+`/account/insurance-notify?id=${id}`, JSON.stringify(body),options);
      return response;
    
  }

  GetUserInfo(token:string)
  {
   
    console.log(token);
     let headers=new HttpHeaders({
      'Content-Type':'application/json; charset-UTF-8',
       'Authorization': `Bearer ${token}`})
    
     let options = {
       headers:headers
     }
     // console.log(headers);
     var response =  this.http.get(this._apiUrl+"/account/user-info" , options);
      return response; 
    
  }

  GetUserPolicyDetails(id,token)
  {
   
     let headers=new HttpHeaders({
      'Content-Type':'application/json; charset-UTF-8',
       'Authorization': `Bearer ${token}`})
    
     let options = {
       headers:headers
     }
     // console.log(headers);
     var response =  this.http.get(this._apiUrl+`/account/policy-detail?id=${id}` , options);
      return response;
    
  }

  GetUserAllPolicies(token:string)
  {
     let headers=new HttpHeaders({
      'Content-Type':'application/json; charset-UTF-8',
       'Authorization': `Bearer ${token}`})
    
     let options = {
       headers:headers
     }
     console.log(headers);
     var response =  this.http.get(this._apiUrl+`/account/policy` , options);
    
    return response;
    
  }

  getToken()
  {
    var userData=this.storage.get('WbAuth').then((token)=>
    {

    })
  }

  GetUserInsurance(id,token)
  {
   
     let headers=new HttpHeaders({
      'Content-Type':'application/json; charset-UTF-8',
       'Authorization': `Bearer ${token}`})
    
     let options = {
       headers:headers
     }
     // console.log(headers);
     var response =  this.http.get(this._apiUrl+`/account/policy-detail?id=${id}` , options);
      return response;
    
  }

  postResendotp(body,file)
  {
    let headers=new HttpHeaders({
      'Content-Type':'application/json; charset-UTF-8'
      // 'Authorization': 'Basic ' + btoa(`${body}`)
    });

    let options = {
      headers:headers
    }
    var response =  this.http.post(this.server + file ,JSON.stringify(body),options)
    console.log(response);
    console.log(body)
    return response;
  }

  EncryptId(Id:string):string
  {
    return CryptoJS.AES.encrypt(Id, "WB").toString();
  }
  DecryptId(encryptText:string):string
  {
    return CryptoJS.AES.decrypt(encryptText.trim(), "WB").toString(CryptoJS.enc.Utf8);  
  }

  barcodeScanner(){
    
  }

  getWithToken(scan,token): Observable<any> {
    // console.log(authToken)
    let header=new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
     //'Content-Type':'application/json',
      //'Authorization': `Bearer ${token}`
     })
console.log(scan)
console.log(token)
    return this.http.get(`${this._driverslicencebarcodedecoderUrl}${scan}&token=${token}`,{ headers: header }).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }

  postArNo(body,file,token){
    let headers=new HttpHeaders({
      'Content-Type':'application/json; charset-UTF-8',
      'Authorization': `Bearer ${token}`
    });
    let options = {
      headers:headers
    }
    console.log(body);
    var response =  this.http.post(this._arNumber + file ,JSON.stringify(body),options)
    console.log(response);
    return response;
  }

  // postCovers(body,endpoint){
  //   let headers=new HttpHeaders({
  //     'Content-Type':'application/json; charset-UTF-8',
  //     //'Authorization': `Bearer ${token}`
  //   });
  //   let options = {
  //     headers:headers
  //   }
  //   // debugger
  //   var response = this.http.post(`${this._coverapi + endpoint}`, body,options)
  //   console.log(response);
  //   return response;

  // }

  postCreatePanic(body,endpoint,token){
    
    let headers=new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
     'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`
     })
     console.log(token);

     console.log(headers);
   
    let options = {
      headers:headers
    }
    // console.log(headers);
     var response =  this.http.post(`${this._apiUrl + endpoint}`, JSON.stringify(body),options);
     return response;
  }

  getArNo(id,endpo,token){
    let header=new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'Content-Type':'application/json; charset-UTF-8',
      'Authorization': `Bearer ${token}`
     })
 
     return this.http.get(`${this._arNumber}${endpo}${id}`,{ headers: header }).pipe(
      map((res) => res),
      catchError((err) => throwError(err))
    );
  }
  

}
