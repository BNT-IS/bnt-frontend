This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run deploy`

Baut ein neues optimiertes package und publiziert es im Github-Branch gh-pages.
Dieser Branch wird von Github-Pages als Quelle verwendet. Aus diesem Grund muss das Repository public sein. Github-Pages ist aktiviert, damit die Web-App gleich nach dem deploy unter einer SSL-gesicherten Adresse getestet werden kann. Dies ist beispielsweise für die Kamera-Funktion (QR-Scannen) nötig!

Die Github-Page des Repositorys kann unter [https://bnt-is.github.io/bnt-frontend/](https://bnt-is.github.io/bnt-frontend/) aufgerufen werden.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


### login function
Beim Erstellprozess eines neuen Users wird diesem ein Access-Token, eine eindeutige Benutzer-ID, eine E-Mail-Adresse und eine Userrolle zugewiesen. Diese Werte werden sowohl in der Datenbank als auch im LocalStorage des Browsers gespeichert. In der Datenbank wird zusätzlich das gewählte Passwort als Hashwert abgespeichert. Nach einer Anmeldung mit E-Mail-Adresse und Passwort werden die Werte aus der Datenbank geholt und lokal in der Applikation sowie im LocalStorage des Browsers gespeichert. Über den Header der Applikation kann eine Login- oder Logout-Funktion aufgerufen werden. Bei der Login-Funktion werden die bestehenden Werte aus dem LocalStorage des Browsers entnommen, überprüft und lokal in der Applikation verwendet. Somit ist hierbei keine erneute Anmeldung erforderlich. Bei fehlenden Werten wird zur Anmeldefunktion mit E-Mail-Adresse und Passwort übergeleitet. Durch die Logout-Funktion werden die lokal gespeicherten Werte der Applikation zurückgesetzt. Bei jeglicher Form der Anmeldung soll der Benutzer, je nach zugeordneter Rolle, auf eine andere Startseite weitergeleitet werden (Benutzeransichtansicht bzw. Eventmanagement).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


# Auflistung der Komponenten

## Gast


## Eventmanagament

### SystemInitialisierung
Die Komponente Systeminitialisierung ist für die erstmalige Konfiguration im Backend verantwortlich.
Die Komponente besteht aus den Klassen:
- Hauptansicht
- AddWallet
- ConfigureAdminAccount
- ConfigureDatabase
- ConfigureMailserver
- AbsolventenListe
- SystemInitalisierung

Die Klasse SystemInitalisierung verwaltet die MAP mit den Werten welche Einrichtungsschritte bereits abgeschlossen sind und stellt die Funktion changeValueOfmapTest zum ändern der Werte zur Verfügung. Zusätzlich steuert die Klasse, welche anderen Klassen in der Weboberfläche angezeigt werden mit dem Wert InitializeStep und der Funktion changeStep.

Die Hauptansicht ruft die MAP mit den Einrichtungsschritten ab und zeigt diese in einer Tabelle an. Die Boolean- und Key-Werte der Map werden in sprechendere String Werte übersetzt. Die Hauptansicht wird zu Beginn (InitializeStep = 0) und am Ende (InitializeStep = 6) Angezeigt.

Die Klasse AddWallet stellt ein Textfeld zur Eingabe des HTTP-Providers bereit und sendet dieses über die Route "setup/generateWallet" an das Backend, dass ein Wallet für den Admin erstellt.

```
{httpProvider: String}
DNS-Name des httpProvider:Port
```

