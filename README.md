Description: 
This sample demonstrates a very simple Angular 4 App the shows the top level of your OneDrive library. It uses Hello.js for authentication.

Since we use the 2.0 authentication protocols to get the Access token, we can log in with either a Microsoft account or an organizational account credentials. To log in go to index.html. If you are already logged in an want change accounts, clicke the "Logout" button below.

You can change the Files location by changing the paths in getFiles() and getUploadSession in the home.service.ts file. Or you can make the paths dynamic or subject to user input.
Keywords: Graph API Upload Large File Drives OAuth Angular Angular4 node.js TypeScript AAD Exchange Contacts


To run the sample:
 - Create an Azure AD Application at https://apps.dev.microsoft.com
 - Configure the a Redirect URL to match your development environmnet (e.g. http://localhost:5500.  Note, some browsers may send a trailing '/' so best to add the form as well).
 - Enable 'Allow Implicit Flow.'
 - Give 'Contacts.Read Files.Readwrite' permission scope.
 - Change values of the "appId"  variable in the config.ts file.