import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { AccidentSceneModel, CommonCasualty, DangerousGoods, OtherDriveVehicleInfo, OtherDriverInfo, OtherVehicleDamageModel, RoadConditionModal, SpecialObservations, SubmitEmail, WitnessInfo, YourPersonalInfo, YourVehicleDamageModel, YourVehicleInfo } from "../pages/tabs/Model/claim.model";
@Injectable()
export class ClaimService {
  _apiUrl: string = "https://api.claimtec.co.za/v1/";
  constructor(private http: HttpClient, private storage: Storage) { }

  StartClaim(id, body, token) {
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };
    var response = this.http.post(
      this._apiUrl + "claim/start-claim?id=0",
      JSON.stringify(body),
      options
    );
    return response;
  }
  AddYourPersonalInfo(token, yourPersonalInfo: YourPersonalInfo) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    var response = this.http.post(
      this._apiUrl + "claim/your-personal-info",
      yourPersonalInfo,
      options
    );
    return response;
  }
  GetYouVehicleInfo(token, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(
      this._apiUrl + "claim/get-your-vehicle-info?id=" + id,
      options
    );
    return response;
  }
  AddYourVehicleInfo(token, yourVehicleInfo: YourVehicleInfo) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    var response = this.http.post(
      this._apiUrl + "claim/your-vehicle-info",
      yourVehicleInfo,
      options
    );
    return response;
  }
  getTheirVehicleDamage(token, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(
      this._apiUrl + "claim/get-their-vehicle-damage?id=" + id,
      options
    );
    return response;
  }
  SaveOtherAccidentDammage(
    token,
    otherVehicleDamageModel: OtherVehicleDamageModel
  ) {
    //console.log(formdata.get('file'));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };

    var response = this.http.post(
      this._apiUrl + "claim/their-vehicle-damage",
      otherVehicleDamageModel,
      options
    );
    return response;
  }
  AddSpecialObservations(token, specialObservations: SpecialObservations) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    var response = this.http.post(
      this._apiUrl + "claim/special-observations",
      specialObservations,
      options
    );
    return response;
  }
  getYourPersonalInfo(token, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(
      this._apiUrl + "claim/get-your-personal-info?id=" + id,
      options
    );
    return response;
  }
  AddOtherDriveVehicleInfo(
    token,
    otherDriveVehicleInfo: OtherDriveVehicleInfo
  ) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    var response = this.http.post(
      this._apiUrl + "claim/other-drive-vehicle-info",
      otherDriveVehicleInfo,
      options
    );
    return response;
  }
  getOtherDriveVehicleInfo(token, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(
      this._apiUrl + "claim/get-other-drive-vehicle-info?id=" + id,
      options
    );
    return response;
  }
  getOtherDriverInfo(token, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(
      this._apiUrl + "claim/get-other-drive-info?id=" + id,
      options
    );
    return response;
  }
  AddCasualityInfo(token, commonCasualty: CommonCasualty, type: string, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    let response: Observable<object>;
    switch (type) {
      case "cyclist":
        response = this.http.post(
          this._apiUrl + "claim/cyclist-info?id=" + id,
          commonCasualty,
          options
        );
        break;
      case "pedestrian":
        response = this.http.post(
          this._apiUrl + "claim/pedestrians-info?id=" + id,
          commonCasualty,
          options
        );
        break;
      case "passenger":
        response = this.http.post(
          this._apiUrl + "claim/passenger-info?id=" + id,
          commonCasualty,
          options
        );
        break;
    }
    return response;
  }
  GetWitnessInfo(token, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(
      this._apiUrl + "claim/get-witness-personal-info?id=" + id,
      options
    );
    return response;
  }
  AddOtherDriverInfo(token, otherDriveInfo: OtherDriverInfo) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    var response = this.http.post(
      this._apiUrl + "claim/other-drive-info",
      otherDriveInfo,
      options
    );
    return response;
  }
  AddWitnessInfo(token, witnessInfo: WitnessInfo) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    var response = this.http.post(
      this._apiUrl + "/claim/witness-personal-info",
      witnessInfo,
      options
    );
    return response;
  }
  SaveAccidentScene(token, accidentSceneModel: AccidentSceneModel) {
    //console.log(formdata.get('file'));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    var response = this.http.post(
      this._apiUrl + "claim/accident-scene",
      accidentSceneModel,
      options
    );
    return response;
  }
  AddDangerousGoods(token, dangerousGoods: DangerousGoods) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    var response = this.http.post(
      this._apiUrl + "claim/dangerous-goods",
      dangerousGoods,
      options
    );
    return response;
  }
  getAccidentSceneById(token, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(
      this._apiUrl + "claim/get-accident-scene?id=" + id,
      options
    );
    return response;
    console.log(options);
  }
  getRoadCondition(token, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(
      this._apiUrl + "claim/get-road-condition?id=" + id,
      options
    );
    return response;
  }
  getYourVehicleDamage(token, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(
      this._apiUrl + "claim/get-your-vehicle-damage?id=" + id,
      options
    );
    return response;
  }
  SaveYourAccidentDammage(
    token,
    yourVehicleDamageModel: YourVehicleDamageModel
  ) {
    console.log(yourVehicleDamageModel);
    //console.log(formdata.get('file'));
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };

    var response = this.http.post(
      this._apiUrl + "claim/your-vehicle-damage",
      yourVehicleDamageModel,
      options
    );
    return response;
  }

  SaveRoadCondition(token, roadConditionModel: RoadConditionModal) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.post(
      this._apiUrl + "/claim/road-condition",
      roadConditionModel,
      options
    );
    return response;
  }


  uploadImage(token, formdata: FormData) { 
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };

    var response = this.http.post(
      this._apiUrl + "claim/upload-image",
      formdata,
      options
    );
    return response;
  }


  getClaimByID(token, id) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(
      this._apiUrl + "claim/claim-list?id=" + 2,
      options
    );
    return response;
  }
  AddSubmitEmail(token, submitEmail: SubmitEmail) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    var response = this.http.post(
      this._apiUrl + "claim/submit-email",
      submitEmail,
      options
    );
    return response;
  }
  getClaimHistory(token) {
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    let options = {
      headers: headers,
    };

    var response = this.http.get(this._apiUrl + "/claim/claim-list", options);
    return response;
  }
}

