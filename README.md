# Überblick

Das Frontend basiert auf dem Javascript-Framework für Frontendentwicklung "React.js". 
Es wurde mit den standard Entwicklertools von React durch npx initiiert (siehe "Entwicklung" und Getting Started der React Dokumentation).

React.js wurde eingesetzt, da es mit seiner Komponenten-basierten Architektur sehr einfach in bestehende Projekte einzubinden ist. Komponenten können innerhalb der Hierarchie der Anwendung schnell "umgehangen" werden. Diese Kapselung durch Komponenten (Entkopplung)  - angelehnt an das Prinzip der minimalen Kopplung in der Objektorientierten Programmierung - ermöglicht die Wiederverwendung von Sub-Komponenten für verschiedene Zwecke. React.js kann von Anfängern in der Frontend-Entwicklung mit wenig Erfahrung in Javascript nach dem Prinzip "Learning by Doing" schnell erlernt werden.

Grund für die Auswahl der Sprache Javascript sowie der Entscheidung für eine Web-Applikation, ist der Geräteunabhängige Einsatz der Applikation.
Die meisten aktuellen Desktop-PCs und Smartphones - unabhängig des Herstellers - bieten mit den Standard-Browsern alle nötigen Voraussetzungen, um diese App später ausführen zu können. Dank der Standards, die W3C für die APIs im Browser durchsetzt sollten nahezu alle Funktionalitäten sowohl auf dem Smartphone, als auch auf dem Desktop äquivalent funktionieren. 

Besonders "spezielle" Funktionalitäten, die vorher nur "nativen" Apps auf dem Smartphone vorbehalten waren sind nun auch für reine web-basierte Anwendungen nutzbar. So kann eine mit SSL gesicherte Web-App unteranderem nun auch eine lokale Datenbank im Browser anlegen (Indexed DB), die Kamera des Smartphones oder Desktop-PCs verwenden, das Mikrofon bei Bedarf ansteuern, die Daten des 3-Achsenbeschleunigungs-Sensors auslesen, Benachrichtigungen anzeigen, das Smartphone vibrieren lassen, auf die Bluetooth-Schnittstelle zugreifen und vieles mehr.

Für die Anwendung des Bachelorsnight Ticketsystems wurden folgende "spezielle" Funktionalitäten zusätzlich eingebunden:

- *Service Worker* für einen Einlass ohne Internet Verbindung (App wird als "Progressive Web App" offline im Browser zwischengespeichert)
- *Indexed DB* für den besagten Einlass zum zwischenspeichern aller Ticketdaten von der Blockchain
- *WebRTC* für den Einlass, sodass mehrere Geräte als Ticketleser innerhalb eines lokalen Netzwerkes mit einem Hauptgerät (Master) mit den Ticket-Daten in der Indexed DB kommunizieren können.
- *Kamera-Funktionalität* für den Einlass, sodass eine Peer-to-Peer-Verbindung zwischen Master und Ticket-Lesern aufgebaut werden kann, ohne etwas eintippen zu müssen. Zusätzlich auch, um die QR-Codes der Tickets scannen zu können.

# Schnellstart

# Komponenten im Detail

## App

Übergeordnete Komponente, die zentrale App-Daten verwaltet.
Hier wird ebenfalls der System-Status in regelmäßigen Abständen (60 Sek.) überprüft.

## Gast

### BookingOverview
Die Komponente BookingOverview zeigt die Buchungen und die in den Buchungen enthaltenen Tickets für den aktuell angemeldeten Benutzer an.
Die Komponente besteht aus den Klassen:
- BestellungsItem
- BookingOverview

Die Klasse BookingOverview ruft für den aktuell angemeldeten Benuzter über die Route 
```
"/api/v2/users/{ID des aktuell angemeldeten Benutzers}/bookings"
```
die für den Benutzer in der Datenbank gespeicherten Buchungen ab.
Anhand der erhaltenen Buchungen werden die in der Buchung enthaltenen Tickets über die Route
``` 
"/api/v2/bookings/{Buchungs-ID}/ticketsBooked"
```
abgerufen.
Die empfangenen Daten zu den Buchungen und Tickets werden von der Klasse BookingOverview an die Klasse BestellungsItem übergeben. Die Klasse BestellungsItem erstellt aus den Daten AccoridionPanels, die anschließend im Accordion der Klasse BookingOverview angezeigt werden. 

### Ticket Bestellung
Die Komponente TicketBestellung erstellt die Buchungen und Tickets für den angemeldeten Benutzer. 
Die Koponente besteht aus den Klassen:
- TicketBestellung
- PersonInput

Die Klasse Ticketbestellung stellt den Verkaufsprozess der Tickets dar.
Die Klasse PersonInput ist eine Hilfsklasse für die TicketBestellung die zur Eingabe der Namen der Gäste verwendet wird.

## Eventmanagament

### EventManagement

### ShopManagament
Die Komponente ShopManagament ist für die Anzeige von Statistiken und Einstellungen während des Verkaufs der Tickets zuständig.
Die Komponente besteht aus den Klassen:
- DataQuickViewMaxTickets
- DataQuickViewPayment
- DataQuickViewBookings
- DataQuickViewSalesStatistics
- DataQuickViewManageSales
- ShopManagement
- DataQuickViewCreateOTPS
- DataQuickViewManageOTPS
- DataQuickViewViewOTPs

und interagiert mit den Komponenten
- ShopManagamentConfMaxTickets
- ShopManagamenetSalesStatistics
- ShopManagamentViewBookings
-
-

#### Klasse - ShopManagament
Die Klasse ShopManagament ist für die Anzeige der entsprechenden Klassen und Komponenten sowie die Verwaltung der zentralen Daten für die Anzeigen verantwortlich. Die Klasse stellt Setter-Funktionen für die entsprechenden Werte bereit, die die einzelnen (DataQuickView)-Klassen aufrufen um die Werte in der Klasse ShopManagamenet zu ändern.

#### Klasse - DataQuickViewMaxTickets
Die Klasse DataQuickViewMaxTickets zeigt die Anzahl der Tickets an, die ein Absolvent mit der derzeitigen Konfiguration erwerben kann. Mit dem Button der Klasse wird der Administrator zur Komponente ShopManagementConfMaxTickets weitergeleitet.

#### Komponente - ShopManagamentConfMaxTickets
Die Komponente ShopManagamentConfMaxTickets stellt Textfelder zur Verüfung mit denen die maximalen Tickets, die ein Absolvent erwerben kann, konfiguriert werden können. Die Werte  werden von der Klasse ShopManagement mit der Route
```
    Route: */api/v2/shopConfig
```
im Backend in der Konfigurationsdatei gespeichert.

#### Klasse - DataQuickViewPayment
Die Klasse DataQuickViewPayment zeigt die Konfigurierten Bezahloptionen an.!!!!!!!!!!!!!!!!!!!!!!!!
!!!!
!!!!

#### Klasse - DataQuickViewBookings
Die Klasse DataQuickViewBookings zeigt die aktuelle Anzahl offener, gebuchter und stornierter Buchungen im System an. Mit dem Button der Klasse wird ein Administrator zur Komponente ShopManagementViewBookings weitergeleitet.

#### Komponente - ShopManagementViewBookings
Die Komponente ShopManagementViewBookings gibt einen ausführlichen Überblick in Form einer Liste über alle Buchungen im System, welche noch als offen gekennzeichnet sind sowie über alle Buchungen im System, welche bereits als bezahlt markiert wurden. Die Komponente bietet für jede Liste die Möglichkeit, über ein Textfeld nach Buchungen mit einer spezifischen E-Mail-Adresse zu suchen. Die noch als offen markierten Buchungen können durch die Komponente freigegeben oder storniert werden, indem der zugehörige Button in der Listenzeile verwendet wird. Die als bezahlt markierten Buchungen können durch die Komponente auf die selbe Art und Weise storniert werden.

#### Klasse - DataQuickViewManageSales
Die Klasse DataQuickViewManageSales zeigt den Status des Verkaufs an. Dieser kann Aktiv oder Deaktiviert sein. Der Wert für den Status wird von der ShopManagement abgerufen. Der Button der Klasse leitet den Administrator zur Komponente ShopManagementManageSalesStatus weiter.

#### Komponente - ShopManagementManageSalesStatus
In der Komponente ShopManagementManageSalesStatus kann der Status des Verkaufs über das Drop-Down Menü aktiviert / deaktiviert werden. Der Status wird von der Klasse ShopManagement mit der Route
```
    Route: */api/v2/shopConfig
```
in der Konfigurationsdatei des Backends gespeichert.

#### Klasse - DataQuickViewCreateOTPS
Die Klasse DataQuickViewCreateOTPS zeigt an, ob bereits eine Liste mit E-Mail-Adressen für die Erstellung der One Time Passwörter und den anschließenden E-Mail-Versand eingelesen wurde. Mit dem Button "Liste einlesen" wird der Administrator zur Komponente ShopManagamentAbsolventenListe weitergeleitet.

#### Komponente - ShopManagamentAbsolventenListe
Die Komponente ShopManagamentAbsolventenListe stellt ein CSV-Reader Feld der Komponente "react-papaparse" zur Verfügung. Mit der Eingabe einer Liste im CSV-Format in der Darstellung
```
eMail;Name
Beispiel@web.de; Mustermann, Max
                .
                .
                .
```
kann eine Liste mit E-Mail-Adressen eingelesen werden. Die eingelesene Liste wird in der Komponente in einer Liste angezeigt. Durch die Bestätigung der eingelesen Liste mit dem Button Abschließen wird für jeden Datensatz in der Liste die Route
```
    Route: */api/v2/oneTimePasses
```
aufgerufen und ein One Time Passwort in der Datenbank erstellt, sowie eine E-Mail mit dem erstellten One Time Passwort versendet. Die Komponente kann nur Benutzer / One Time Passwörter mit der Rolle 1 (Absolvent) erstellen.

#### Klasse - DataQuickViewManageOTPS
Mit dem Button der Klasse DataQuickViewManageOTPS kann zur Komponente ShopManagementManageOTPS gewechselt werden.

#### Komponente - ShopManagementManageOTPS
In der Komponente ShopManagementManageOTPS können neue One Time Passwörter erstellt werden. In das Textfeld muss eine E-Mail-Adresse eingetragen werden und über das Drop-Down-Menü kann die entsprechende Rolle ausgewählt werden. (Rolle 0 = Administrator; Rolle 1 = Benutzer)


### SystemSetup
Die Komponente SystemSetup ist für die erstmalige Konfiguration im Backend verantwortlich.
Die Komponente besteht aus den Klassen:
- SystemSetup
- Hauptansicht
- ConfigureDatabase
- ConfigureAdminAccount
- ConfigureMailserver
- AddWallet
- DeploySmartContract
- ConfigureShopConfig

#### SystemSetup
Die Klasse SystemSetup verwaltet die MAP mit den Werten welche Einrichtungsschritte bereits abgeschlossen sind und stellt die Funktion changeValueOfmapTest zum ändern der Werte zur Verfügung. Zusätzlich steuert die Klasse, welche anderen Klassen in der Weboberfläche angezeigt werden mit dem Wert InitializeStep und der Funktion changeStep.

#### Hauptansicht
Die Hauptansicht ruft die MAP mit den Einrichtungsschritten ab und zeigt diese in einer Tabelle an. Die Boolean- und Key-Werte der Map werden in sprechendere String Werte übersetzt. Die Hauptansicht wird zu Beginn (InitializeStep = 0) und am Ende (InitializeStep = 7) des Einrichtungsvorgangs angezeigt.

#### ConfigureDatabase
Die Klasse ConfigureDatabase stellt 5 Textfelder für die Eingabe der Daten zur Datenbank zur Verfügung. Über die Route 
```
{ 
    Route: */setup/database
}
```
werden die Daten in der Konfiguration gesetzt und das Schema der Datenbank wird initial erstellt.

#### ConfigureAdminAccount
Die Klasse ConfigureAdminAccount stellt ein Textfeld für die Eingabe einer E-Mail-Adresse und ein Passwort für den Administratorbenuzter zur Verfügung. 

```
{
    Voraussetzungen: Intitialisierte Datenbank
}
```

Über die Route 
```
{
    Route: */setup/adminUser
}
```
im Backend wird der Administratorbenutzer (Rolle 0) erstellt und in der Konfigurationsdatei des Backends als erstellt gekennzeichnet.

#### ConfigureMailserver
Die Klasse ConfigureMailserver stellt 6 Textboxen und ein Drop-Down Menü zur Eingabe der Daten für den Mail-Server zur Verfügung. Über die Route  
```
{
    Route: */setup/mailserver
}
```
werden die Einstellungen in die Konfiguration im Backend gespeichert.

#### AddWallet
Die Klasse AddWallet stellt ein Textfeld zur Eingabe des HTTP-Providers bereit und sendet dieses über die Route 
```
{
   Route: */setup/generateWallet
}
```
an das Backend. Das Backend erstellt ein Wallet für den Admin. Ist die Einrichtung des Wallets erfolgreich abgeschlossen, zeigt die Ansicht der Komponente den Ethereum-Preis für die Veröffentlichung des Smart Contracts auf der Blockchain an.

#### DeploySmartContract
Die Klasse DeploySmartContract stellt ein Textfeld zur Eingabe des HTTP-Providers zur Verüfung. Im Admin-Wallet wird eine bestimmte Menge Ethereum benötigt. Dieses ist für die Veröffentlichung des Smart Contracts und die Erstellung eines Tickets.
```
{
    Voraussetzungen:    - Erstelltes Wallet
                        - Ethereum im Wallet 
}
```

Der Smart Contract wird über die Route
```
{
    Route: */setup/deployContract
}
```
im Backend auf der Blockchain veröffentlicht. Nach der erfolgreichen Veröffentlichung des Smart Contracts werden in der Klasse die Preise für die Erstellung und die Übertragung eines Tickets angezeigt.

#### ConfigureShopConfig
Die Klasse ConfigureShopConfig stellt 3 Textboxen für die Eingabe der maximalen Personen pro Event, die maximale Anzahl von Tickets und die maximale Anzahl an VIP-Personen zur Verfügung. Die Werte werden über die Route
 ```
{
    Route: */setup/shopConfig
}
```
in die Konfigurationsdatei im Backend gespeichert. 

# Spezielle Funktionalitäten

## Login und Benutzer-Erstellung
Beim Erstellprozess eines neuen Users wird diesem ein Access-Token, eine eindeutige Benutzer-ID, eine E-Mail-Adresse und eine Userrolle zugewiesen. Diese Werte werden sowohl in der Datenbank als auch im LocalStorage des Browsers gespeichert. In der Datenbank wird zusätzlich das gewählte Passwort als Hashwert abgespeichert. Nach einer Anmeldung mit E-Mail-Adresse und Passwort werden die Werte aus der Datenbank geholt und lokal in der Applikation sowie im LocalStorage des Browsers gespeichert. Über den Header der Applikation kann eine Login- oder Logout-Funktion aufgerufen werden. Bei der Login-Funktion werden die bestehenden Werte aus dem LocalStorage des Browsers entnommen, überprüft und lokal in der Applikation verwendet. Somit ist hierbei keine erneute Anmeldung erforderlich. Bei fehlenden Werten wird zur Anmeldefunktion mit E-Mail-Adresse und Passwort übergeleitet. Durch die Logout-Funktion werden die lokal gespeicherten Werte der Applikation zurückgesetzt. Bei jeglicher Form der Anmeldung soll der Benutzer, je nach zugeordneter Rolle, auf eine andere Startseite weitergeleitet werden (Benutzeransichtansicht bzw. Eventmanagement).

# Entwicklung
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
