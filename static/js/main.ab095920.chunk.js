(this["webpackJsonpexample-client"]=this["webpackJsonpexample-client"]||[]).push([[0],{322:function(e,t,n){e.exports=n(634)},327:function(e,t,n){},329:function(e,t,n){},339:function(e,t){},364:function(e,t){},366:function(e,t){},407:function(e,t){},409:function(e,t){},438:function(e,t){},546:function(e,t){},598:function(e,t,n){},602:function(e,t,n){},603:function(e,t,n){},625:function(e,t,n){},634:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(155),c=n.n(i),s=n(34),o=(n(327),n(9)),l=n.n(o),u=n(26),d=n(15),h=n(16),m=n(28),f=n(19),p=n(25),v=(n(329),n(636)),b=n(644),k=n(647),g=n(78),E=n(649),C=n(650),w=n(130),T=n.n(w),y=n(300),R=n.n(y),x=function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).state={},a.sign=a.sign.bind(Object(m.a)(a)),a.connectWallet=a.connectWallet.bind(Object(m.a)(a)),a}return Object(h.a)(n,[{key:"componentDidMount",value:function(){this.init()}},{key:"displayError",value:function(){alert("Ups, das hat nicht geklappt")}},{key:"init",value:function(){this.setState({walletAvailable:!!window.ethereum}),window.ethereum||(this.walletLink=new R.a({appName:"DHBW Bachelors Night Ticketing 2020",appLogoUrl:"https://einfachtierisch.de/media/cache/article_teaser/cms/2015/09/Katze-lacht-in-die-Kamera-shutterstock-Foonia-76562038.jpg?595617",darkMode:!1}),window.ethereum=this.walletLink.makeWeb3Provider("https://mainnet.infura.io/v3/efaece4f5f4443979063839c124c8171",1)),this.setState({connected:!!window.ethereum.selectedAddress}),this.web3=new T.a(window.ethereum)}},{key:"connectWallet",value:function(){var e=Object(u.a)(l.a.mark((function e(){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.ethereum.enable().catch(this.displayError);case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return");case 5:console.log("User's address is ".concat(t[0])),this.web3.eth.defaultAccount=t[0],this.setState({connected:!0});case 8:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"sign",value:function(){var e=Object(u.a)(l.a.mark((function e(){var t,n,a,r=this;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(window.ethereum){e.next=2;break}return e.abrupt("return",this.displayError());case 2:if(window.ethereum.selectedAddress){e.next=4;break}return e.abrupt("return",this.displayError());case 4:t=window.ethereum.selectedAddress,"Hallo du Frosch!",n=this.web3.utils.stringToHex("Hallo du Frosch!"),a=[n,t],"personal_sign",this.web3.currentProvider.send({method:"personal_sign",params:a,from:t},(function(e,a){if(e)return console.error(e);if(a.error)return console.error(a.error);console.log(a);var i=r.web3.eth.accounts.recover(n,a.result);i.toLowerCase()===t.toLowerCase()?alert("Successfully ecRecovered signer as "+t):alert("Failed to verify signer when comparing "+i+" to "+t)}));case 10:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"linkToDownloadMetaMask",value:function(){window.open("https://wallet.coinbase.com/","_blank")}},{key:"render",value:function(){return r.a.createElement(v.a,{className:"WalletSetup",direction:"column",gap:"medium",pad:"medium"},r.a.createElement("h1",null,"Wallet Setup"),r.a.createElement(E.a,null,"Um Tickets zu erwerben ben\xf6tigen Sie ein sogenanntes Wallet. Dieses ist vergleichbar mit Ihrer Geldb\xf6rse zu der nur Sie Zugriff haben."),!this.state.walletAvailable&&!this.state.connected&&r.a.createElement(v.a,{gap:"medium"},r.a.createElement(E.a,null,"F\xfcr unser Ticket-System muss dieses Wallet Ethereum-f\xe4hig sein. Wir empfehlen Ihnen daher das Coinbase Wallet. Bitte installieren Sie sich das Coinbase Wallet \xfcber die offizielle Website. Kommen Sie nach Abschluss der Einrichtung wieder auf diese Seite zur\xfcck."),r.a.createElement(C.a,{label:"Coinbase f\xfcr's Smartphone installieren",onClick:this.linkToDownloadMetaMask})),!this.state.connected&&r.a.createElement(v.a,{gap:"medium"},r.a.createElement(E.a,null,"Als N\xe4chstes ben\xf6tigt unsere Plattform die Adresse Ihres Wallets. Bitte best\xe4tigen Sie daher die Verbindung mit Ihrem Wallet \xfcber folgende Schaltfl\xe4che. Sie geben dadurch ",r.a.createElement("b",null,"nicht")," Ihre Kontrolle \xfcber das Wallet ab!"),r.a.createElement(C.a,{label:"Mit dem Wallet verbinden",onClick:this.connectWallet})),r.a.createElement(E.a,null,"Hier folgt eine DEMO!!!"),r.a.createElement(C.a,{label:"Sign and Verify Message",onClick:this.sign}))}}]),n}(r.a.Component),O=(n(598),function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).state={},a}return Object(h.a)(n,[{key:"render",value:function(){return r.a.createElement(v.a,{className:"UserMainMenu",direction:"column",gap:"medium",pad:"medium"},r.a.createElement(s.b,{className:"MenuLink",to:"/guest/tickets"},"Tickets Anzeigen"),r.a.createElement(s.b,{className:"MenuLink",to:"/guest/"},"Tickets Bestellen"),r.a.createElement(s.b,{className:"MenuLink",to:"/guest/"},"Bestellungen Anzeigen"),r.a.createElement(s.b,{className:"MenuLink",to:"/guest/setup"},"Setup"))}}]),n}(r.a.Component)),S=(n(602),n(603),n(110)),j=n.n(S),_=function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).state={qrcode:void 0},a.web3=new T.a(T.a.givenProvider||"ws://localhost:8545"),a.state={error:!1},a.sign(),a}return Object(h.a)(n,[{key:"sign",value:function(){var e=Object(u.a)(l.a.mark((function e(){var t,n,a,r=this;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.connect();case 2:return e.next=4,this.getSelectedAddress();case 4:t=e.sent,"Hallo du Frosch!",n=this.web3.utils.stringToHex("Hallo du Frosch!"),a=[n,t],"personal_sign",this.web3.currentProvider.sendAsync({method:"personal_sign",params:a,from:t},(function(e,t){if(e)return r.setState({error:!0}),console.error(e);if(t.error)return r.setState({error:!0}),console.error(t.error);var n=t.result;j.a.toDataURL(n).then((function(e){r.setState({qrcode:e})})).catch((function(e){r.setState({error:!0}),console.error(e)}))}));case 10:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"connect",value:function(){var e=Object(u.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("undefined"===typeof window.ethereum){e.next=3;break}return e.next=3,window.ethereum.enable().catch(console.error);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"getSelectedAddress",value:function(){var e=Object(u.a)(l.a.mark((function e(){var t;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.web3.eth.getAccounts().catch(console.error);case 2:return t=e.sent,e.abrupt("return",t[0].toLowerCase());case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){return r.a.createElement(v.a,{className:"Obliterator",direction:"column",gap:"medium",pad:"medium"},!this.state.error&&r.a.createElement(v.a,null,r.a.createElement("img",{src:this.state.qrcode,alt:"QRCODE",width:"300px",height:"300px"}),r.a.createElement("h2",null,this.props.ticketType)),this.state.error&&r.a.createElement(v.a,null,r.a.createElement(E.a,null,"Ups, das hat nicht geklappt!")),r.a.createElement(C.a,{label:"Fertig",onClick:this.props.onReady}))}}]),n}(r.a.Component),D=function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).obliterate=a.obliterate.bind(Object(m.a)(a)),a.onReadyHandler=a.onReadyHandler.bind(Object(m.a)(a)),a.state={obliterate:void 0},a}return Object(h.a)(n,[{key:"onReadyHandler",value:function(){this.setState({obliterate:void 0})}},{key:"obliterate",value:function(){this.setState({obliterate:"Absolvent"})}},{key:"render",value:function(){return r.a.createElement(v.a,{className:"TicketOverview",direction:"column",gap:"medium",pad:"medium"},r.a.createElement(v.a,null,r.a.createElement(v.a,null,r.a.createElement("h1",{className:"NumberOfTickets"},"4")),r.a.createElement(v.a,null,r.a.createElement(v.a,{className:"Ticket",direction:"row",gap:"small",pad:"small"},r.a.createElement(E.a,{className:"Type"},"Absolvent"),r.a.createElement(C.a,{label:"Einl\xf6sen",onClick:this.obliterate})),r.a.createElement(v.a,{className:"Ticket",direction:"row",gap:"small",pad:"small"},r.a.createElement(E.a,{className:"Type"},"Gast Regul\xe4r"),r.a.createElement(C.a,{label:"Einl\xf6sen",onClick:this.obliterate})),r.a.createElement(v.a,{className:"Ticket",direction:"row",gap:"small",pad:"small"},r.a.createElement(E.a,{className:"Type"},"Gast Regul\xe4r"),r.a.createElement(C.a,{label:"Einl\xf6sen",onClick:this.obliterate})),r.a.createElement(v.a,{className:"Ticket",direction:"row",gap:"small",pad:"small"},r.a.createElement(E.a,{className:"Type"},"Parken"),r.a.createElement(C.a,{label:"Einl\xf6sen",onClick:this.obliterate})))),this.state.obliterate&&r.a.createElement(_,{ticketType:this.state.obliterate,onReady:this.onReadyHandler}))}}]),n}(r.a.Component),H=function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).state={},a}return Object(h.a)(n,[{key:"render",value:function(){return r.a.createElement(v.a,{className:"Guest"},r.a.createElement(b.a,{background:"brand",justify:"between",pad:"10px"},r.a.createElement(s.b,{to:"/guest"},"Home"),r.a.createElement(k.a,{label:"Account",items:[{label:"Logout"}]})),r.a.createElement(g.c,null,r.a.createElement(g.a,{path:"/guest/tickets"},r.a.createElement(D,null)),r.a.createElement(g.a,{path:"/guest/setup"},r.a.createElement(x,null)),r.a.createElement(g.a,{path:"/guest/"},r.a.createElement(O,null))))}}]),n}(r.a.Component),M=n(319),N=n(317),A=n.n(N),L=function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).state={},a.video=r.a.createRef(),a.canvasElement=r.a.createRef(),a.startScan=a.startScan.bind(Object(m.a)(a)),a.tick=a.tick.bind(Object(m.a)(a)),a}return Object(h.a)(n,[{key:"componentWillUnmount",value:function(){this.stopScan()}},{key:"tick",value:function(){if(this.video&&this.video.current){if(this.video.current.readyState===this.video.current.HAVE_ENOUGH_DATA){this.canvasElement.current.height=320,this.canvasElement.current.width=320,this.canvas.drawImage(this.video.current,0,0,this.canvasElement.current.width,this.canvasElement.current.height);var e=this.canvas.getImageData(0,0,this.canvasElement.current.width,this.canvasElement.current.height),t=A()(e.data,e.width,e.height,{inversionAttempts:"dontInvert"});if(t)switch(this.props.contentType){case"ETHEREUM_ADDRESS":var n=t.data.match(Object(M.a)(/(?:ethereum:)(0x[0-9A-Za-z]*)/,{address:1}));if(n&&n.groups.address)return this.stopScan(),void this.props.onDone(n.groups.address);break;case"ETHEREUM_SIGNATURE":case"IP_ADDRESS":case"JSON_DATA":break;default:return this.stopScan(),void this.props.onDone(t.data)}}requestAnimationFrame(this.tick)}}},{key:"startScan",value:function(){var e=this;if(!navigator.mediaDevices)return alert("Der Browser unterst\xfctzt diese Funktion nicht.");navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:320,height:320}}).then((function(t){e.canvas=e.canvasElement.current.getContext("2d"),e.video.current.srcObject=t,e.video.current.setAttribute("playsinline",!0),e.video.current.play(),requestAnimationFrame(e.tick),e.setState({isScanning:!0})})).catch((function(e){console.error(e),alert("Sorry, Kamera-Stream konnte nicht geladen werden.")}))}},{key:"stopScan",value:function(){this.video&&this.video.current&&this.video.current.srcObject&&(this.video.current.srcObject.getVideoTracks()[0].stop(),this.setState({isScanning:!1}))}},{key:"render",value:function(){return r.a.createElement(v.a,{className:"QRScanner"},r.a.createElement("div",null,r.a.createElement("canvas",{ref:this.canvasElement,hidden:!this.state.isScanning}),r.a.createElement("video",{ref:this.video,hidden:!0})),!this.state.isScanning&&r.a.createElement(C.a,{label:this.props.label||"Scan",onClick:this.startScan}))}}]),n}(r.a.Component),B=(n(625),function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).state={},a}return Object(h.a)(n,[{key:"render",value:function(){return r.a.createElement("div",{className:"dialog"},r.a.createElement("div",{className:"dialog-background-box"}),r.a.createElement("div",{className:"dialog-center"},r.a.createElement("div",{className:"dialog-content"},r.a.createElement("div",{className:"dialog-header"},r.a.createElement("h1",null,this.props.title),r.a.createElement(C.a,{className:"abort",onClick:this.props.onAbort},"X")),r.a.createElement("div",{className:"dialog-body"},this.props.children))))}}]),n}(r.a.Component)),I=(n(299),n(115)),U=n.n(I),P=function(){function e(){Object(d.a)(this,e),this.requestMap=new Map,this._iceCandidatesHandler=this._iceCandidatesHandler.bind(this),this._dataChannelOpenHandler=this._dataChannelOpenHandler.bind(this),this._receiveChannelHandler=this._receiveChannelHandler.bind(this),this._generateAnswerCode=this._generateAnswerCode.bind(this),this.setMasterConfig=this.setMasterConfig.bind(this),this._dataChannelClosedHandler=this._dataChannelClosedHandler.bind(this),this._connectionChangeHandler=this._connectionChangeHandler.bind(this),this._initConnection(),this.onConnectionChanged=function(e){}}return Object(h.a)(e,[{key:"_initConnection",value:function(){this.icecandidates=[],this.localPeerConnection=new RTCPeerConnection(null),this.localPeerConnection.addEventListener("icecandidate",this._iceCandidatesHandler),this.localPeerConnection.addEventListener("connectionstatechange",this._connectionChangeHandler),this.localPeerConnection.addEventListener("datachannel",this._receiveChannelHandler)}},{key:"_iceCandidatesHandler",value:function(e){this.icecandidates.push(e.candidate),this.answer&&!this.qrcode&&setTimeout(this._generateAnswerCode,200)}},{key:"_connectionChangeHandler",value:function(e){console.debug(e);var t=e.target.connectionState;this.onConnectionChanged(t)}},{key:"_dataChannelOpenHandler",value:function(e){console.debug(e),this.onReady(),this.dataChannel.send("Hallo Master!")}},{key:"_dataChannelClosedHandler",value:function(e){console.debug(e)}},{key:"_messageHandler",value:function(e){console.debug(e.data),alert(e.data)}},{key:"_receiveChannelHandler",value:function(e){this.dataChannel=e.channel,this.dataChannel.addEventListener("message",this._messageHandler),this.dataChannel.addEventListener("open",this._dataChannelOpenHandler),this.dataChannel.addEventListener("close",this._dataChannelClosedHandler)}},{key:"_createUUID",value:function(){var e=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(t){var n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"===t?n:0&n).toString(16)}))}},{key:"readTicketRemote",value:function(e){var t=this;return new Promise((function(n,a){var r=t._createUUID();t.requestMap.set(r,{resolve:n,reject:a});var i={type:"Request",reqId:r,context:"ticketMirror",method:"getTicket",params:[e]};try{t.dataChannel.send(JSON.stringify(i))}catch(c){a(c)}}))}},{key:"obliterateTicketRemote",value:function(e,t){var n=this;return new Promise((function(a,r){var i=n._createUUID();n.requestMap.set(i,{resolve:a,reject:r});var c={type:"Request",reqId:i,context:"ticketMirror",method:"obliterateTicket",params:[e,t]};try{n.dataChannel.send(JSON.stringify(c))}catch(s){r(s)}}))}},{key:"_generateAnswerCode",value:function(){var e=Object(u.a)(l.a.mark((function e(){var t,n,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={answer:this.answer,candidates:this.icecandidates},n=U.a.deflate(JSON.stringify(t),{level:9,to:"string"}),e.next=4,j.a.toDataURL(n).catch(console.error);case 4:a=e.sent,this.qrcode=a,this.onAnswerCode(a);case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"setMasterConfig",value:function(){var e=Object(u.a)(l.a.mark((function e(t){var n,a=this;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=JSON.parse(U.a.inflate(t,{to:"string"})),e.next=3,this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(n.offer)).catch(console.error);case 3:return n.candidates.forEach((function(e){a.localPeerConnection.addIceCandidate(e).catch(console.error)})),e.next=6,this.localPeerConnection.createAnswer().catch(console.error);case 6:return this.answer=e.sent,e.next=9,this.localPeerConnection.setLocalDescription(this.answer).catch(console.error);case 9:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),W=function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).state={connected:!1},a.connectTicketReader=a.connectTicketReader.bind(Object(m.a)(a)),a}return Object(h.a)(n,[{key:"connectTicketReader",value:function(){var e=this,t=new P;t.onReady=function(){e.ticketReader=e.state.connectTR,e.setState({connectTR:null,connected:!0})},t.onConnectionChanged=function(t){e.setState({connected:t})},t.onAnswerCode=function(t){e.setState({TRQRCode:t,connectTRStep:1})},this.setState({connectTR:t,connectTRStep:0})}},{key:"render",value:function(){var e=this;return r.a.createElement(v.a,{className:"EntranceManagement",pad:"medium"},"connected"===!this.state.connected&&r.a.createElement(v.a,null,r.a.createElement("p",null,"Wenn Sie dieses Ger\xe4t als Ticket Leser verwenden m\xf6chten, m\xfcssen Sie es erst mit dem Event-Manager verbinden."),r.a.createElement("p",null,"Bitte stellen Sie sicher, dass dieses Ger\xe4t mit dem selben lokalen Netzwerk, wie der Event-Manager verbunden ist."),r.a.createElement(C.a,{onClick:this.connectTicketReader,label:"Ticket Reader Aktivieren"}),this.state.connectTR&&r.a.createElement(B,{title:"Als Ticket Reader verbinden",onAbort:function(){e.setState({connectTR:null})}},0===this.state.connectTRStep&&r.a.createElement("div",null,r.a.createElement("div",{className:"scanner"},r.a.createElement(L,{onDone:this.state.connectTR.setMasterConfig,label:"Scanvorgang starten"})),r.a.createElement("div",{className:"description"},r.a.createElement("p",null,"Bitte den Code des Initiators scannen"))),1===this.state.connectTRStep&&r.a.createElement("div",null,r.a.createElement("div",{className:"qrcode"},!this.state.TRQRCode&&r.a.createElement("div",{className:"loader"},"Loading..."),this.state.TRQRCode&&r.a.createElement("img",{src:this.state.TRQRCode,width:"100%",alt:"Ein QR-Code sollte hier angezeigt werden."})),r.a.createElement("div",{className:"description"},r.a.createElement("p",null,"Bitte nun mit dem Initiator Ger\xe4t scannen"))))),"connected"===this.state.connected&&r.a.createElement(g.c,null,r.a.createElement(g.a,{path:"/entrance/"},r.a.createElement("p",null,"Wunderbar, Sie sind verbunden..."),r.a.createElement("p",null,"In Zukunft sollten hier Funktionen zum Ticket-Scan stehen..."),r.a.createElement(C.a,{label:"Lese ein Beispiel Ticket",onClick:function(){e.ticketReader.readTicketRemote("2537f4c1-2bfa-416f-9098-9b61fe4bb59d")}}),r.a.createElement(C.a,{label:"Entwerte Ticket",onClick:function(){e.ticketReader.obliterateTicketRemote(123,"signature")}}),r.a.createElement(C.a,{label:"Beispiel Funktion 3"}))),"disconnected"===this.state.connected&&r.a.createElement(g.c,null,r.a.createElement(g.a,{path:"/entrance/"},r.a.createElement("p",null,"Die Verbindung wurde unterbrochen!"),r.a.createElement("p",null,"Bitte warten Sie einen Moment..."))))}}]),n}(r.a.Component),q=function(){function e(){if(Object(d.a)(this,e),this._createDB=this._createDB.bind(this),this.dumpTicketMirror=this.dumpTicketMirror.bind(this),this.getTicketList=this.getTicketList.bind(this),!window.indexedDB)throw Error("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");this.waitingForIDBReadyQueue=[],this._initDB()}return Object(h.a)(e,[{key:"_initDB",value:function(){var e=this;console.debug("Initializing IDB Connection");var t=window.indexedDB.open("TicketMirror",1);t.addEventListener("upgradeneeded",this._createDB),t.addEventListener("success",(function(t){console.debug("IDB Connection established"),e.db=t.target.result,e.waitingForIDBReadyQueue.forEach((function(t){t(e.db)}))})),t.addEventListener("error",(function(e){console.error("Database error: "+e.target.errorCode)}))}},{key:"_createDB",value:function(e){this.db=e.target.result,this.db.createObjectStore("tickets",{keyPath:"identifier"})}},{key:"_getIDB",value:function(){var e=this;return new Promise((function(t){e.db?t(e.db):e.waitingForIDBReadyQueue.push(t)}))}},{key:"dumpTicketMirror",value:function(){var e=Object(u.a)(l.a.mark((function e(){var t,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this._getIDB().catch(console.error);case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return");case 5:n=t.transaction("tickets","readwrite").objectStore("tickets"),[{identifier:"ca6c9409-0ec9-42fb-9ca7-d42a74642d7e",isValid:!0,isUsed:!1,ticketType:"Parken"},{identifier:"cea4b540-63a4-4abd-9a9a-499bb3879b8c",isValid:!1,isUsed:!0,ticketType:"Begleitperson"},{identifier:"2537f4c1-2bfa-416f-9098-9b61fe4bb59d",isValid:!0,isUsed:!1,ticketType:"Begleitperson"},{identifier:"c3573a44-f9e8-4772-bf80-57d1d07239c8",isValid:!0,isUsed:!0,ticketType:"Begleitperson"},{identifier:"5506d14d-8090-411a-897c-3f6c898ec8d2",isValid:!0,isUsed:!0,ticketType:"Begleitperson"}].forEach((function(e){n.add(e)}));case 8:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getTicketList",value:function(){var e=this;return new Promise(function(){var t=Object(u.a)(l.a.mark((function t(n,a){var r,i,c;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e._getIDB().catch(console.error);case 2:if(r=t.sent){t.next=5;break}return t.abrupt("return",a());case 5:i=r.transaction("tickets","readonly").objectStore("tickets"),(c=i.getAll()).onerror=a,c.onsuccess=function(e){var t=e.target.result;return n(t)};case 9:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}())}},{key:"getTicket",value:function(e){var t=this;return new Promise(function(){var n=Object(u.a)(l.a.mark((function n(a,r){var i,c,s;return l.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,t._getIDB().catch(console.error);case 2:if(i=n.sent){n.next=5;break}return n.abrupt("return",r());case 5:c=i.transaction("tickets","readonly").objectStore("tickets"),(s=c.get(e)).onerror=r,s.onsuccess=function(e){var t=e.target.result;return t?a(t):r("Ticket does not exist.")};case 9:case"end":return n.stop()}}),n)})));return function(e,t){return n.apply(this,arguments)}}())}},{key:"obliterateTicket",value:function(e,t){var n=this;return new Promise(function(){var t=Object(u.a)(l.a.mark((function t(a,r){var i,c,s;return l.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n._getIDB().catch(console.error);case 2:if(i=t.sent){t.next=5;break}return t.abrupt("return",r());case 5:c=i.transaction("tickets","readwrite").objectStore("tickets"),(s=c.get(e)).onerror=r,s.onsuccess=function(e){var t=e.target.result;if(!t)return r("Ticket does not exist.");if(!t.isValid)return r("Ticket is not valid.");if(t.isUsed)return r("Ticket was already used.");t.isUsed=!0;var n=c.put(t);n.onerror=r,n.onsuccess=a};case 9:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}())}}]),e}(),z=function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;if(Object(d.a)(this,n),(a=t.call(this,e)).state={tickets:[]},a.handleDumpMirror=a.handleDumpMirror.bind(Object(m.a)(a)),a.showTickets=a.showTickets.bind(Object(m.a)(a)),!a.props.localTicketMirror)throw new Error("Missing LocalTicketMirror");return a.showTickets(),a}return Object(h.a)(n,[{key:"handleDumpMirror",value:function(){this.props.localTicketMirror.dumpTicketMirror(),this.showTickets()}},{key:"showTickets",value:function(){var e=Object(u.a)(l.a.mark((function e(){var t,n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.localTicketMirror,e.next=3,t.getTicketList().catch(console.error);case 3:if(n=e.sent){e.next=6;break}return e.abrupt("return");case 6:this.setState({tickets:n});case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state.tickets.map((function(e){return r.a.createElement("li",{key:e.identifier},e.isValid&&"Valid",!e.isValid&&"Not Valid"," -  ",e.isUsed&&"Used",!e.isUsed&&"Not Used"," - ",e.ticketType)}));return r.a.createElement(v.a,{className:"IndexedDBExample",pad:"medium"},r.a.createElement("ul",null,e),r.a.createElement(C.a,{label:"Dump Mirror",onClick:this.handleDumpMirror}))}}]),n}(r.a.Component),F=function(){function e(){Object(d.a)(this,e),this._iceCandidatesHandler=this._iceCandidatesHandler.bind(this),this._dataChannelOpenHandler=this._dataChannelOpenHandler.bind(this),this._generateOfferCode=this._generateOfferCode.bind(this),this._dataChannelClosedHandler=this._dataChannelClosedHandler.bind(this),this._connectionChangeHandler=this._connectionChangeHandler.bind(this),this.setTicketReaderConfig=this.setTicketReaderConfig.bind(this),this._messageHandler=this._messageHandler.bind(this),this.uuid=this._createUUID(),this.onConnectionChanged=function(e){},this.onReady=function(){},this.onOfferCode=function(e){},this.onGetTicket=function(e,t){},this.onObliterateTicket=function(e,t,n){},this._initConnection()}return Object(h.a)(e,[{key:"_initConnection",value:function(){this.icecandidates=[],this.localPeerConnection=new RTCPeerConnection(null),this.localPeerConnection.addEventListener("icecandidate",this._iceCandidatesHandler),this.localPeerConnection.addEventListener("connectionstatechange",this._connectionChangeHandler),this.dataChannel=this.localPeerConnection.createDataChannel("sendDataChannel",null),this.dataChannel.addEventListener("message",this._messageHandler),this.dataChannel.addEventListener("open",this._dataChannelOpenHandler),this.dataChannel.addEventListener("close",this._dataChannelClosedHandler),this._createOffer()}},{key:"_iceCandidatesHandler",value:function(e){this.icecandidates.push(e.candidate),this.offer&&!this.qrcode&&setTimeout(this._generateOfferCode,200)}},{key:"_connectionChangeHandler",value:function(e){console.debug(e);var t=e.target.connectionState;this.onConnectionChanged(t)}},{key:"_dataChannelOpenHandler",value:function(e){console.debug(e),this.onReady(),this.dataChannel.send("Hallo Client!")}},{key:"_dataChannelClosedHandler",value:function(e){console.debug("Data Channel Closed",e)}},{key:"_messageHandler",value:function(e){var t,n=this;console.debug("Message received:",e.data);try{t=JSON.parse(e.data)}catch(a){return console.error(a),void console.debug("Message was:",e.data)}switch(t.context){case"ticketMirror":"getTicket"===t.method?this.onGetTicket(t.params[0],(function(e,a){var r={reqId:t.reqId,result:{ticket:e,errorMessage:a}};try{n.dataChannel.send(JSON.stringify(r))}catch(i){console.error(i)}})):"obliterateTicket"===t.method&&this.onObliterateTicket(t.params[0],t.params[1],(function(e,a){var r={reqId:t.reqId,result:{success:e,errorMessage:a}};try{n.dataChannel.send(JSON.stringify(r))}catch(i){console.error(i)}}))}}},{key:"_createUUID",value:function(){var e=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(t){var n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"===t?n:0&n).toString(16)}))}},{key:"_createOffer",value:function(){var e=Object(u.a)(l.a.mark((function e(){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.localPeerConnection.createOffer().catch(console.error);case 2:return this.offer=e.sent,e.next=5,this.localPeerConnection.setLocalDescription(this.offer).catch(console.error);case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"_generateOfferCode",value:function(){var e=Object(u.a)(l.a.mark((function e(){var t,n,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={offer:this.offer,candidates:this.icecandidates},n=U.a.deflate(JSON.stringify(t),{level:9,to:"string"}),e.next=4,j.a.toDataURL(n).catch(console.error);case 4:a=e.sent,this.qrcode=a,this.onOfferCode(a);case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"setTicketReaderConfig",value:function(){var e=Object(u.a)(l.a.mark((function e(t){var n,a=this;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=JSON.parse(U.a.inflate(t,{to:"string"})),e.next=3,this.localPeerConnection.setRemoteDescription(new RTCSessionDescription(n.answer)).catch(this.handleError);case 3:n.candidates.forEach((function(e){a.localPeerConnection.addIceCandidate(e).catch(a.handleError)}));case 4:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),G=function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).state={},a.connectRemoteTicketReader=a.connectRemoteTicketReader.bind(Object(m.a)(a)),a}return Object(h.a)(n,[{key:"connectRemoteTicketReader",value:function(){var e=this,t=new F;t.onReady=function(){e.setState({connectRTR:null}),e.props.onRTR(t)},t.onOfferCode=function(t){e.setState({RTRQRCode:t})},this.setState({connectRTR:t,addRTRStep:0})}},{key:"disconnectRemoteTicketReader",value:function(e){}},{key:"disconnectAll",value:function(){}},{key:"render",value:function(){var e=this;return r.a.createElement(v.a,{className:"TicketReaderManager",pad:"medium"},r.a.createElement("p",null,"Derzeit sind ",this.props.RTRList.length," Ticket Leser verbunden."),r.a.createElement(C.a,{onClick:this.connectRemoteTicketReader,label:"Ticket Leser Hinzuf\xfcgen"}),this.state.connectRTR&&r.a.createElement(B,{title:"Remote Ticket Reader Hinzuf\xfcgen",onAbort:function(){e.setState({connectRTR:null})}},0===this.state.addRTRStep&&r.a.createElement("div",null,r.a.createElement("div",{className:"ticket-reader-qrcode"},!this.state.RTRQRCode&&r.a.createElement("div",{className:"loader"},"Loading..."),this.state.RTRQRCode&&r.a.createElement("img",{src:this.state.RTRQRCode,width:"100%",alt:"Ein QR-Code sollte hier angezeigt werden."})),r.a.createElement("div",{className:"ticket-reader-description"},r.a.createElement("p",null,"Bitte mit dem Zielger\xe4t scannen")),r.a.createElement("div",{className:"ticket-reader-action"},r.a.createElement(C.a,{onClick:function(){e.setState({addRTRStep:1})},label:"Weiter"}))),1===this.state.addRTRStep&&r.a.createElement("div",null,r.a.createElement("div",{className:"ticket-reader-scanner"},r.a.createElement(L,{onDone:this.state.connectRTR.setTicketReaderConfig,label:"Scanvorgang starten"})),r.a.createElement("div",{className:"ticket-reader-description"},r.a.createElement("p",null,"Bitte nun den Code des Zielger\xe4ts scannen")))))}}]),n}(r.a.Component),Q=function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).rTRHandler=a.rTRHandler.bind(Object(m.a)(a)),a.localTicketMirror=new q,a.state={RTRList:[]},a}return Object(h.a)(n,[{key:"rTRHandler",value:function(e){var t=this,n=this.state.RTRList;n.push(e),this.setState({RTRList:n}),e.onConnectionChanged=function(e){console.log(e)},e.onGetTicket=function(e,n){t.localTicketMirror.getTicket(e).then((function(e){n(e)})).catch((function(e){n(null,e)}))},e.onObliterateTicket=function(e,t,n){n(!0)}}},{key:"render",value:function(){return r.a.createElement(v.a,{className:"EventManagement"},r.a.createElement("ul",null,r.a.createElement("li",null,r.a.createElement(s.b,{to:"/eventmgmt/rtrm"},"Manage Remote Ticket Readers")),r.a.createElement("li",null,r.a.createElement(s.b,{to:"/eventmgmt/entrancedb"},"Show Entrance Dashboard")),r.a.createElement("li",null,r.a.createElement(s.b,{to:"/eventmgmt/ticketshop"},"Manage Ticketshop"))),r.a.createElement(g.c,null,r.a.createElement(g.a,{path:"/eventmgmt/rtrm"},r.a.createElement(G,{RTRList:this.state.RTRList,onRTR:this.rTRHandler})),r.a.createElement(g.a,{path:"/eventmgmt/entrancedb"},r.a.createElement(z,{localTicketMirror:this.localTicketMirror})),r.a.createElement(g.a,{path:"/eventmgmt/ticketshop"},r.a.createElement(v.a,{pad:"medium"},"Hier m\xfcsste dann sowas wie ein Ticketshop Management Dashboard hin..."))))}}]),n}(r.a.Component),V=n(648),J=n(646),K=function(e){Object(f.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(d.a)(this,n),(a=t.call(this,e)).state={account:null},a.scanDoneHandler=a.scanDoneHandler.bind(Object(m.a)(a)),a.obliterateTokens=a.obliterateTokens.bind(Object(m.a)(a)),a}return Object(h.a)(n,[{key:"errorDisplay",value:function(e){alert("Sorry, there was an error. Please try again.")}},{key:"scanDoneHandler",value:function(e){var t=this;this.getAccountDetails(e).then((function(n){if(!n.verified)return alert("Account nicht f\xfcr TBN-Nutzung verifiziert");t.getAccountBalance(e).then((function(a){var r=t.state;r.account={address:e,balance:a,verified:n.verified,paidTickets:n.paidTickets,poolTickets:n.poolTickets,parkTickets:n.parkTickets},t.setState(r)}))}))}},{key:"getAccountBalance",value:function(){var e=Object(u.a)(l.a.mark((function e(t){var n,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("http://localhost:3000/balanceOf?address="+t,{method:"GET",mode:"cors",cache:"no-cache"}).catch(this.errorDisplay);case 2:return n=e.sent,e.next=5,n.json().catch(this.errorDisplay);case 5:return a=e.sent,e.abrupt("return",a);case 7:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getAccountDetails",value:function(){var e=Object(u.a)(l.a.mark((function e(t){var n,a;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("http://localhost:3000/accountDetails?address="+t,{method:"GET",mode:"cors",cache:"no-cache"}).catch(this.errorDisplay);case 2:return n=e.sent,e.next=5,n.json().catch(this.errorDisplay);case 5:return a=e.sent,e.abrupt("return",a);case 7:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"obliterateTokens",value:function(e){var t=this;return new Promise((function(e,n){setTimeout((function(){e("\xdcbertragen"),t.scanDoneHandler(null)}),3e3)}))}},{key:"render",value:function(){return r.a.createElement(V.a,{theme:J.a},r.a.createElement(g.c,null,r.a.createElement(g.a,{exact:!0,path:"/"},r.a.createElement("ul",null,r.a.createElement("li",null,r.a.createElement(s.b,{to:"/guest"},"Gast")),r.a.createElement("li",null,r.a.createElement(s.b,{to:"/entrance"},"Einlass-Management")),r.a.createElement("li",null,r.a.createElement(s.b,{to:"/eventmgmt"},"Event-Management"))))),r.a.createElement(g.c,null,r.a.createElement(g.a,{path:"/guest"},r.a.createElement(H,null)),r.a.createElement(g.a,{path:"/entrance"},r.a.createElement(W,null)),r.a.createElement(g.a,{path:"/eventmgmt"},r.a.createElement(Q,null))))}}]),n}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(s.a,null,r.a.createElement(K,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[322,1,2]]]);
//# sourceMappingURL=main.ab095920.chunk.js.map