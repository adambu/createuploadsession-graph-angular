Checked in by: adambu
Date Created: 01/27/2018

Product Area Tags: Azure, Graph / OneDrive, 

Technology Tags: Client OM, JavaScript / JSOM, REST, 

Use Case: 
The customer needed an Angular sample which uses the Microsoft Graph API resumable upload method called 'createUploadSession.'  The resumable upload session approach is needed for uploading files larger than 4 MB to SharePoint or OneDrive usning Graph API REST enpoints.

Description: 
This sample demonstrates a very simple Angular 4 App the shows the top level of your OneDrive library. It uses Hello.js for authentication.

Since we use the 2.0 authentication protocols to get the Access token, we can log in with either a Microsoft account or an organizational account credentials. To log in go to index.html. If you are already logged in an want change accounts, clicke the "Logout" button below.

You can change the Files location by changing the paths in getFiles() and getUploadSession in the home.service.ts file. Or you can make the paths dynamic or subject to user input.
Keywords: Graph API Upload Large File Drives OAuth Angular Angular4 node.js TypeScript AAD Exchange Contacts

Code Example Disclaimer:
Sample Code is provided for the purpose of illustration only and is not intended to be used in a production environment. THIS SAMPLE CODE AND ANY RELATED INFORMATION ARE PROVIDED 'AS IS'
-This is intended as a sample of how code might be written for a similar purpose and you will need to make changes to fit to your requirements. 
-This code has not been tested.  This code is also not to be considered best practices or prescriptive guidance.  
-No debugging or error handling has been implemented.
-It is highly recommended that you FULLY understand what this code is doing  and use this code at your own risk.
