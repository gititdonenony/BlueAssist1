/* eslint-disable no-var */
import { Platform } from '@ionic/angular';
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment, apiEndpoints } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = environment.url;
  constructor(private http: HttpClient) { }
  getLogin(body) {
    const headers = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset-UTF-8',
        Authorization: 'Basic ' + btoa(`${body.Username}:${body.Password}`),
      }),
    };
    const response = this.http.get(
      `${environment.url + environment.apiAuth + apiEndpoints.login}`,
      headers
    );
    return response;
  }


  getLoginBYNumber(body) {
    const headers = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset-UTF-8',
        Authorization: 'Basic ' + btoa(`${body.Phone}`),
      }),
    };
    const param = new FormData();
    param.append('phone', body.Phone)
    const response = this.http.post(
      `${environment.url + environment.apiAuth + apiEndpoints.loginByNumber}`,
      param
    );
    return response;
  }


  imageUpload(response, token) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset-UTF-8',
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiClaim + apiEndpoints.uploadImage}`,
      response,
      headers
    );
  }
  imageBase64Upload(response, token) {
    const headers = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset-UTF-8',
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiClaim + apiEndpoints.uploadBase64Image
      }`,
      JSON.stringify(response),
      headers
    );
  }

  updateProfile(response, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.updateUserInfo
      }`,
      response,
      headers
    );
  }
  userInfomation(token) {
    console.log("user info tokrn " + token);

    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.userInfo}`,
      headers
    );
  }

  postPanic(data, type) {
    const token = JSON.parse(localStorage.getItem('userLoginData')).token;
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    const body = new FormData();
    body.append('lat', data.latitude);
    body.append('lng', data.longitude);
    body.append('panic_type', type.panicType ? type.panicType : '');
    body.append('panic_sub_type', type.subPanicType ? type.subPanicType : '');

    return this.http.post(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.emergencyAssistance
      }`,
      body,
      headers
    );
  }



  postLatLngForRapidZone(data) {
    const token = JSON.parse(localStorage.getItem('userLoginData')).token;
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    const body = new FormData();
    body.append('lat', data.latitude);
    body.append('lng', data.longitude);

    // https://api.claimtec.co.za/v1/account/rapidzone

     console.log('environment.url--------', environment.url)
     console.log('environment.apiAccount--------', environment.apiAccount)
     console.log('apiEndpoints.emergencyAssistance--------', apiEndpoints.rapidzone)

    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.rapidzone}`,
      body,
      headers
    );
  }

  async printCurrentPosition() {
    const cords = await Geolocation.getCurrentPosition();
    return cords;
  }

  async askToTurnOnGPS(): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      LocationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          // the accuracy option will be ignored by iOS
          LocationAccuracy.request(
            LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
          ).then(
            () => {
              resolve(true);
              //window.alert('Auto Gps on');
            },
            (error) => {
              resolve(false);
              //window.alert(`err${JSON.stringify(error)}`);
            }
          );
        } else {
          resolve(false);
          //window.alert('Unable to get Auto GPS on permission');
        }
      });
    });
  }
  getEmergencyContactById(id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.getEmergencyContact
      }?id=${id}`,
      headers
    );
  }
  getEmergencyContact(token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.getEmergencyContact
      }`,
      headers
    );
  }
  emergencyContact(response, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.emergencyContact
      }`,
      response,
      headers
    );
  }
  updateEmergencyContact(response, id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.emergencyContact
      }?id=${id}`,
      response,
      headers
    );
  }
  getInviteFamilyById(id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.getInviteFamily
      }?id=${id}`,
      headers
    );
  }
  getInviteFamily(token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.getInviteFamily
      }`,
      headers
    );
  }
  inviteFamily(response, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.inviteFamily}`,
      response,
      headers
    );
  }
  updateInviteFamily(response, id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.inviteFamily
      }?id=${id}`,
      response,
      headers
    );
  }
  medicalInfo(response, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.medicalInfo}`,
      response,
      headers
    );
  }
  getMedicalInfo(token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.getMedicalInfo
      }`,
      headers
    );
  }
  vehicle(response, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.vehicle}`,
      response,
      headers
    );
  }
  updateVehicle(response, id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.vehicle
      }?id=${id}`,
      response,
      headers
    );
  }
  getVehicle(token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.getVehicle}`,
      headers
    );
  }
  getVehicleById(id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.getVehicle
      }?id=${id}`,
      headers
    );
  }
  updateMedicalInfo(response, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.updateMedicalInfo
      }`,
      response,
      headers
    );
  }
  deleteVehicleInfo(id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.delete(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.deleteVehicleInfo
      }?id=${id}`,
      headers
    );
  }
  deleteInviteFamily(id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.delete(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.deleteInviteFamily
      }?id=${id}`,
      headers
    );
  }
  deleteEmergencyContact(id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.delete(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.deleteEmergencyContact
      }?id=${id}`,
      headers
    );
  }
  potholePost(response, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.pothole}`,
      response,
      headers
    );
  }
  getPothole(type, token, id) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.getPothole
      }?type=${type}&id=${id}`,
      headers
    );
  }
  allBasket(token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.allBasket}`,
      headers
    );
  }

  addToBasket(token, vechicleId) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.addToBasket
      }?id=${vechicleId}`,
      headers
    );
  }

  deleteItemLicenceRenewel(id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.deleteItem
      }?id=${id}`,
      headers
    );
  }
  itemUploadDocument(response, token, v) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };

    const body = new FormData();
    body.append('filename', response.fileName);
    body.append('type', response.type);
    return this.http.post(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.itemUploadDocument
      }?id=${v.item_id}&vehicle_id=${v.vehicle_id}`,
      body,
      headers
    );
  }

  getDeliveryAddress() {
    const token = JSON.parse(localStorage.getItem('userLoginData')).token;
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.deliveryAddess.get
      }`,
      headers
    );
  }

  addDeliveryAddress(payload) {
    const token = JSON.parse(localStorage.getItem('userLoginData')).token;
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.deliveryAddess.add
      }`,
      payload,
      headers
    );
  }

  getCheckoutUrl(params) {
    const token = JSON.parse(localStorage.getItem('userLoginData')).token;
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.cart.getcheckoutUrl
      }?id=${params.addressId}&cart_id=${params.cartId}`,
      headers
    );
  }
  incidentPost(response) {
    const data = new FormData();
    data.append('vehicle_id', response.vehicle_id);
    data.append('incident_where', response.incident_where);
    data.append('incident_date', response.incident_date);
    data.append('incident_sapsno', response.incident_sapsno);
    data.append('incident_whathappened', response.incident_whathappened);
    data.append('pothole_img1', response.pothole_img1);
    data.append('pothole_img2', response.pothole_img2);
    data.append('pothole_img3', response.pothole_img3);
    data.append('pothole_img4', response.pothole_img4);
    data.append('incident_img1', response.incident_img1);
    data.append('incident_img2', response.incident_img2);
    data.append('incident_img3', response.incident_img3);
    data.append('incident_img4', response.incident_img4);
    data.append('vehicle_img1', response.vehicle_img1);
    data.append('vehicle_img2', response.vehicle_img2);
    data.append('vehicle_img3', response.vehicle_img3);
    data.append('vehicle_img4', response.vehicle_img4);
    const token = JSON.parse(localStorage.getItem('userLoginData')).token;
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.incident}`,
      data,
      headers
    );
  }

  roadCoverPost(response, id) {
    const token = JSON.parse(localStorage.getItem('userLoginData')).token;
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.raf.postClaim
      }?id=${id}`,
      response,
      headers
    );
  }

  getFines(id, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.fines.getFines
      }?id=${id}`,
      headers
    );
  }

  checkoutFine(id, idNumber, token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url +
      environment.apiAccount +
      apiEndpoints.fines.checkOutFine
      }?id=${id}&idNumber=${idNumber}`,
      headers
    );
  }

  addFine(payload) {
    const token = JSON.parse(localStorage.getItem('userLoginData')).token;
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.url + environment.apiAccount + apiEndpoints.fines.addFine
      }`,
      payload,
      headers
    );
  }



  getSignup(details) {
    console.log(details.Username);
    console.log(details.Phone);
    console.log(details.Email);
    const param = new FormData();
    param.append('name', details.Username);
    param.append('phone', details.Phone);
    param.append('email', details.Email);
    return this.http.post(
      `${environment.url + environment.apiAuth + apiEndpoints.getSignup}`,
      param,
    );
  }

  sendOTP(user_id) {
    console.log(user_id);
    const param = new FormData();
    param.append('id', user_id);
    return this.http.post(
      `${environment.url + environment.apiAuth + apiEndpoints.sendOTP}`,
      param,
    );
  }

  verifyOtp(user_id, userotp) {
    console.log(user_id);
    const param = new FormData();
    param.append('id', user_id);
    param.append('otp', userotp);
    return this.http.post(
      `${environment.url + environment.apiAuth + apiEndpoints.verifyOtp}`,
      param,
    );
  }

  verifyLoginOtp(user_id, userotp) {
    console.log(user_id);
    const param = new FormData();
    param.append('id', user_id);
    param.append('otp', userotp);
    return this.http.post(
      `${environment.url + environment.apiAuth + apiEndpoints.verifyLoginOtp}`,
      param,
    );
  }


  checkPaymentStatus(id) {
    return this.http.get(`${environment.url + environment.apiAuth + apiEndpoints.paymentStatus}?id=${id}`);
  }



  upgradePlan(token) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(
      `${environment.url + environment.apiAccount + apiEndpoints.upgradePlan}`,
      headers
    );
  }
}
