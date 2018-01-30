import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { User } from './user.model';
import { DriveItem } from './driveItem.model';

import { HomeService } from './home.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  template: `
  <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
  <div class="container">
      <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">

              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
          </button>
      </div>
      <div class="navbar-collapse collapse">

      </div>
  </div>
</div>
<br />
<div class="row">
<div class="col-xs-10 col-xs-offset-1" style="background-color:azure">
    <div class="page-header">
        <h1>Angular JS Create Upload Session Example</h1>
    </div>
    <p>This sample demonstrates a very simple Angular 4 App the shows the top level of your OneDrive library.  It uses Hello.js for authentication.</p>
    <p>Since we use the <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols">2.0 authentication protocols</a>
     to get the Access token, we can log in with either a Microsoft account or an organizational account credentials.  To log in go to <a href="./index.html">index.html</a>.
     If you are already logged in an want change accounts, clicke the "Logout" button below.
    <p>You can change the Files location by changing the paths in getFiles() and getUploadSession in the home.service.ts file. Or you can make the paths dynamic or subject to user input.</p>
</div>
</div>
  <div class="container" role="main">
    <div class="row">
      <div class="col-xs-10 col-xs-offset-1">
        <div class="app-error"></div>
        <div class="data-loading"></div>
        <div class="panel-body">
          <table>
            <tr>
              <td colspan="2"><h3>Here are your Contacts</h3></td>
            </tr>
            <tr>
              <th align="left">Name</th>
              <th align="left">Email</th>
            </tr>
            <tr *ngFor="let user of users">
              <td>{{user?.displayName}}</td>
              <td>{{user?.emailAddresses[0]?.address}}</td>
            </tr>
            <tr>
              <td colspan="2"><h3>Here are your Files</h3></td>
            </tr>
            <tr>
              <td colspan="2">
                <table  class="table table-striped table-bordered table-condensed table-hover">
                  <tr>
                    <th align="left">Name</th>
                    <th align="left">Type</th>
                    <th align="left">Size</th>
                  </tr>
                  <tr *ngFor="let driveItem of driveItems">
                    <td>{{driveItem.name}}</td>
                    <td>{{driveItem.folder ? "Folder" : "File"}}</td>
                    <td>{{driveItem.size}}</td>
                  </tr>
                </table>        
              </td>     
            <tr>
              <td colspan="2"><h3>Upload a large file.</h3></td>
            </tr>
            <tr>
              <td align="left"><input type="file" id="trigger" class="ng-hide" (change)="onFileSelected($event)" accept="*/*"></td>
              <td align="left"><button (click)="onUpload()">Upload</button> </td>
            </tr> 
            <tr>
              <td colspan="2"><button (click)="onLogout()">Logout</button> </td>
            </tr>  
          </table>     
        </div>
      </div>
    </div>
  </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  users: User[];
  driveItems: DriveItem[];
  subsGetUsers: Subscription;
  subsGetFiles: Subscription;

  file: File;

  constructor(
    private homeService: HomeService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.subsGetUsers = this.homeService.getUsers().subscribe(users => this.users = users);
    this.subsGetFiles = this.homeService.getFiles().subscribe(driveItems => this.driveItems = driveItems);
  }

  ngOnDestroy() {
    this.subsGetUsers.unsubscribe();

  }

  onFileSelected(event) {
    this.file = event.srcElement.files[0];
  }

  onUpload() {
    var uploadUrl
    var file = this.file;
    var homeService = this.homeService;
    var i = file.name.lastIndexOf('.');
    var fileType = file.name.substring(i + 1);
    var fileName = file.name.substring(0, i);
    homeService.getUploadSession(fileType, fileName).subscribe(function (data) {

      uploadUrl = data.uploadUrl;
      homeService.uploadChunks.call(homeService, file, uploadUrl);
    });

  }

  onLogout() {
    this.authService.logout();
  }
} 
