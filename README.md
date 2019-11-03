# Safarnama 
Safarnama is a platform for creating, publishing, and exploring cultural heritage experiences. 

## Creating experiences 
Users can create and publish experiences using the authoring application, documentation for this can be found here.

## Viewing experiences
Users can view experiences using the Android App, documentation for this can be found here. 

## API
The API is written with Node.js and Typescript using an Express router. It follows a simple layered architecture of Router -> Controller -> Data access repo. Mongoose is used for accessing MongoDB and Passport.js for authentication. 

### TODO
* Better layering on the API. The controllers, should not have any dependency on Express or the req/res params. 
* Cleaner error handling. 
* Clean up the App.ts, this can be separated into initialisation files.
* Unit testing.
