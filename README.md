# Safarnama 
Safarnama is a platform for creating, publishing, and exploring cultural heritage experiences. Users use the "Authoring tool" to create experiences, they can then publish these experiences so they are downloadable from the mobile app. 

## Authoring Tool

The authoring tool allows users to create and edit cultural heritage experiences. It is written in Angular and currently served at https://safarnama.lancs.ac.uk. It talks to the backend over a HTTP RESTful API.

### Creating and editing an experience

**Creating**

When creating an experience you can enter a  `Name`, `Description` and `Project`. You can always edit the `Name` and `Description` later under *Experience -> Edit*. Assinging an experience to a project allows admins of that project to feature it within their apps, and will assign you to the project as a `creator`. Admins of that project can promote any `creator` to a project `admin`, and they can then manage features of the project. 

**Collaborators**

An experience can have multiple collaborators. To add a collaborator to an experience click *Experience -> Collaborators*, here you can enter the `User ID` of the collaborator you'd like to add. Your `User ID` is also visible on this screen, so you can share it to other users who may want to add you as a collabortor. This functionality is currently quite primitive, there is no realtime updating of the authoring tool, so if multiple users are editing at the same time then there is the possibility to overwrtie each others changes. 

### Places

Places are the fundamental part of an experience, they can be thought of as points of interest, and are represented by icons on the map. 

**Creating**

To create a `Place` choose *Places -> Create*. You can then click anywhere on the map to place a pin. The grey circle around the pin is called the `Trigger Zone`. When a mobile user enters this circle they will receive a push notification, when pressed this will link them to a screen to view information about this place. 

Place `Types`are a way of grouping related places. They have a `Name` and `Icon`  assigned to them, and this icon will be shown on all places of this type on the map. There is a key in the mobile application that shows what each `Icon` is called, similar to a key on a traditional map. You can select from a list of predefined place types, or add your own by scrolling down inside the place type dropdown and selecting *Add new*. When adding a new place type you can give it a `Name`, upload your own `Icon`as a `png`, or select an `Icon` from the icon library. Uploaded icons must be formatted as a `png` and less than `400KB`.

**Editing**

You can edit a `Place` by clicking it on the map, or by going to *Places -> View all* and selecting *Edit*. Places can also be deleted by either selecting them on the map, or again from *View all*. 

### Routes

Routes allow you to draw on the map, they might be used to suggest where you recommend the user walks, or to show a historacal journey.

**Creating**

To create a `Route` choose *Routes -> Create*. You can then click anywhere on the map to place the first point of the route. You can keep clicking to add more points to the route. The flags indicate the route start and route end. You can also give a route a `Name` and `Description`, this will be visible to users when they press it on the map. A colour can be selected which will change the colour of the line on the map. 

**Editing**

You can edit a `Route` by clicking it on the map, or by going to *Places -> View all* and selecting *Edit*. `Routes` can also be deleted by either selecting them on the map, or again from *View all*. 

### Publishing an experience 

Once you are happy with an experience and ready to make it public, you can choose to publish it. To do this select *Publish* from the side menu and then press *Publish*. A QR code will be displayed, when scanned on a mobile device with the app installed this will allow the user to download and play your experinece! A link is also displayed which will also open the experience, if you would rather use a link than a QR code. When an experience is published Safarnama essentially saves a snapshot of it's current state. Any further changes are not reflected in the published experience until you press *Publish changes*. This allows you to keep making many edits without making them live until you are happy with them. 

**Featured experiences**

A published experience is different to a featured experience. Project administrators can choose to `Feature` published experiences from the *Projects* menu. These experiences will show up in the list of featured experiences within the mobile app, and a user does not have to scan a QR code or press any kind of link to download them.

## Mobile App

The Safarnama mobile app allows users to download and explore cultural heritage experiences. The app is written in React Native, and available on both iOS and Android. 

### Viewing experiences

Once the user has the app scanning an experience QR code, either with Safarma or with their native device camera app, or pressing an experience link will allow them to view or download an experience. Users can choose to either view and explore the experience immediately, or download the experience. *Downloading* the experience will ensure that all experience data, including media, is downloaded locally onto the users device. This may be useful in areas with limited mobile internet coverage, or to improve accesibility for users without mobile internet plans at all. Users may also choose to view any experience from the list of featured experiences, and this does not require them to have a QR code or experience link.

Users can easily switch between experiences from the side menu, and there are options to download additional experiences. The user can press on any place directly on the map to view information and media about that place, in addition, if they physically enter a place's trigger zone then they will receive a push notification linking to that place. 

As experiences are edited and changes published in the authoring tool the mobile app will keep these up to date, so the user should always have the latest version.

## Tech stack notes 

### API

The API is written with Node.js and Typescript using an Express router. It follows a simple layered architecture of Router -> Controller -> Data access repo. Mongoose is used for accessing MongoDB and Passport.js for authentication. 

- "filepreview" dependency is currently forked as it was locked to an old version of synchronise, which was in turn using an old version of fibers that wasn't compatible with Node 14.

### TODO
* Better architecture on the API. The controllers, should not have any dependency on Express or the req/res params. 
* Improve error handling. 
* Clean up the App.ts, this can be separated into initialisation files.
* Unit and integration test
* Realtime collaboration on the authoring tool.