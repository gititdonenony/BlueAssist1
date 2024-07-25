import { StorageService } from "src/app/services/storage.service";
import { apiConfig } from "src/api-url.config";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError, map, retry } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PdfDownloaderService {
  API_END_POINT: string;

  constructor(private http: HttpClient, private storage: StorageService) {
    this.API_END_POINT = environment.url;
  }

  downloadPdfById(token: string, id: string) {
    //console.log(token, id);
    let headers = new HttpHeaders({
      "Content-Type": "application/json; charset-UTF-8",
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };
    // console.log(headers);
    var response = this.http.get(
      `${this.API_END_POINT}${apiConfig.downloadPdf}?id=${id}`,
      options
    );
    return response;
  }

  getDlDetails(body, token) {
    let headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    let options = {
      headers: headers,
    };

    var response = this.http.post(
      this.API_END_POINT + apiConfig.getDl,
      JSON.stringify(body),
      options
    );
    return response;
  }
}
