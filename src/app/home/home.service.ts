import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { extractData, handleError } from '../shared/http-helper';
import { HttpService } from '../shared/http.service';
import { User } from './user.model';
import { DriveItem } from './driveItem.model';

import * as request from 'superagent';

@Injectable()
export class HomeService {
  url = 'https://graph.microsoft.com/v1.0';
  file = 'demo1.xlsx';
  table = 'Table1';

  constructor(
    private http: Http,
    private httpService: HttpService) {
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get(`${this.url}/me/contacts?$select = displayName, emailAddresses`, this.httpService.getAuthRequestOptions())
      .map(extractData)
      .catch(handleError);
  }

  getFiles(): Observable<DriveItem[]> {
    return this.http
      .get(`${this.url}/me/drive/root/children`, this.httpService.getAuthRequestOptions())
      .map(extractData)
      .catch(handleError);
  }



  ///All file upload stuff until the end/////
  getUploadSession(fileType, name): Observable<any> {
    console.log('getUploadSession method called::'); 
    const token = window.sessionStorage.getItem('accessToken');
    /*  Below is an example of and endpoint for a folder (Drive) in SharePoint.   */
    //const endpoint = `https://graph.microsoft.com/v1.0/drives/b!7A6PTEH3RUGW0qt6F_Laq1iQc2YiSkNMsVbYSuhfKYSr4Fv0CEOaS705AiLlR7sH/root:/${name}.${fileType}:/createUploadSession`;
    const endpoint = `https://graph.microsoft.com/v1.0/me/drive/root:/${name}.${fileType}:/createUploadSession`;


    const body = {
      "item": {
        "@microsoft.graph.conflictBehavior": "rename"
      }
    };
    //const options = new RequestOptions({ headers: headers });
    var options = this.httpService.getAuthRequestOptions();
    return this.http.post(endpoint, body, options).map(res => res.json());
  }

  /*  function uploadChunks
        After getting the uploadUrl, this function does the logic of chunking out 
        the fragments and sending the chunks to uploadChunk */
  async uploadChunks(file, uploadUrl) {
    const homeService = this;
    var reader = new FileReader();

    // Variables for byte stream position
    var position = 0;
    var chunkLength = 320 * 1024;
    console.log('File size is: ' + file.size);
    var continueRead = true;
    while (continueRead) {
      var chunk;
      try {
        continueRead = true;
        //Try to read in the chunk
        try {
          let stopB = position + chunkLength;
          console.log('Sending Asynchronous request to read in chunk bytes from position ' + position + ' to end ' + stopB)
          chunk = await this.readFragmentAsync(file, position, stopB);
          console.log("UploadChunks: Chunk read in of " + chunk.byteLength + " bytes.");
          if (chunk.byteLength > 0) {
            continueRead = true;
          } else {
            break;
          }
          console.log('Chunk bytes received = ' + chunk.byteLength);
        } catch (e) {
          console.log('Bytes Received from readFragmentAsync:: ' + e);
          break;
        }
        // Try to upload the chunk.
        try {
          console.log('Request sent for uploadFragmentAsync');
          let res = await homeService.uploadChunk(chunk, uploadUrl, position, file.size);
          // Check the response.
          if (res[0] != 202 && res[0] != 201 && res[0] != 200)
            throw ("Put operation did not return expected response");
          if (res[0] === 201 || res[0] === 200) {
            console.log("Reached last chunk of file.  Status code is: " + res[0]);
            continueRead = false; 
          }
          else {
            console.log("Continuing - Status Code is: " + res[0]);
            position = Number(res[1].nextExpectedRanges[0].split('-')[0])
          }
          
          console.log('Response received from uploadChunk.');
          console.log('Position is now ' + position);

        } catch (e) {
          console.log('Error occured when calling uploadChunk::' + e);
        }
        //
      } catch (e) {
        continueRead = false;
      }
    }
    location.reload(true);
  }
  // Reads in the chunck and returns a promise.
  readFragmentAsync(file, startB, stopB) {
    var frag = "";
    const reader = new FileReader();
    console.log('startBytes :' + startB + ' stopBytes :' + stopB)
    var blob = file.slice(startB, stopB);
    reader.readAsArrayBuffer(blob);
    return new Promise((resolve, reject) => {
      reader.onloadend = (event) => {
        console.log("onloadend called  " + reader.result.byteLength);
        if (reader.readyState == reader.DONE) {
          frag = reader.result
          resolve(frag);
        }
      };
    })
  }

  // Upload each chunk using PUT
  uploadChunk(chunk, uploadURL, position, totalLength) {//: Observable<any> {        
    let max = position + chunk.byteLength - 1;
    let contentLength = position + chunk.byteLength;

    console.log(chunk.byteLength);

    return new Promise((resolve, reject) => {
      console.log('uploadURL:: ' + uploadURL);

      try {
        console.log('Just before making the PUT call to uploadUrl.');
        let crHeader = `bytes ${position}-${max}/${totalLength}`;
        console.log('Content-Range header being set is : ' + crHeader);
        request
          .put(uploadURL)
          .set({ 'Content-Range': crHeader })
          .send(chunk)
          .end((err, res) => {
            if (err) {
              console.error(err);
              reject(err);
              return;
            }

            console.log(res.status);
            console.log(res.body);
            resolve([res.status, res.body]);

          });
      } catch (e) {
        console.log('exception inside uploadFragmentAsync::  ' + e)
        reject(e);
      }
    });
  }
}
