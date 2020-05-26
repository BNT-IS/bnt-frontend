import React from 'react';
import jsQR from 'jsqr';
import { Box, Button } from 'grommet';

class QRScanner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.video = React.createRef();
    this.canvasElement = React.createRef();
    this.startScan = this.startScan.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentWillUnmount(){
    this.stopScan();
  }

  tick() {
    if (!this.video || !this.video.current) return;
    if (this.video.current.readyState === this.video.current.HAVE_ENOUGH_DATA) {
      this.canvasElement.current.height = 320;
      this.canvasElement.current.width = 320;
      this.canvas.drawImage(this.video.current, 0, 0, this.canvasElement.current.width, this.canvasElement.current.height);
      let imageData = this.canvas.getImageData(0, 0, this.canvasElement.current.width, this.canvasElement.current.height);
      let code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
      if (code) {
        // Selecting the right search pattern
        // This should be defined via props: contentType
        switch (this.props.contentType) {
          case 'ETHEREUM_ADDRESS':
            let match = code.data.match(/(?:ethereum:)(?<address>0x[A-Za-z\d]*)/);
            if (match && match.groups.address) {
              this.stopScan();
              this.props.onDone(match.groups.address);
              return;
            }
            break;
          case 'ETHEREUM_SIGNATURE':
            // TODO: enter regex
            break;
          case 'IP_ADDRESS':
            // TODO: enter regex
            break;
          case 'JSON_DATA':
            // TODO: enter regex
            break;
          default:
            this.stopScan();
            this.props.onDone(code.data);
            return;
        }
      }
    }
    requestAnimationFrame(this.tick);
  }

  startScan() {
    if (!navigator.mediaDevices) return alert('Der Browser unterstützt diese Funktion nicht.');
    const constraints = { video: { facingMode: "environment", width: 320, height: 320 } }
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        /* use the stream */
        this.canvas = this.canvasElement.current.getContext("2d");
        this.video.current.srcObject = stream;
        this.video.current.setAttribute('playsinline', true);
        this.video.current.play();
        requestAnimationFrame(this.tick);
        this.setState({ isScanning: true });
      })
      .catch(function (err) {
        console.error(err);
        /* handle the error */
        alert('Sorry, Kamera-Stream konnte nicht geladen werden.');
      });
  }

  stopScan() {
    if (!this.video || !this.video.current || !this.video.current.srcObject) return;
    let videoTracks = this.video.current.srcObject.getVideoTracks();
    videoTracks[0].stop();
    this.setState({ isScanning: false });
  }

  render() {
    return (
      <Box className="QRScanner">
        <div>
          <canvas ref={this.canvasElement} hidden={!this.state.isScanning} />
          <video ref={this.video} hidden />
        </div>
        {!this.state.isScanning && <Button label={this.props.label || "Scan"} onClick={this.startScan}></Button>}
      </Box>
    );
  }
}

export default QRScanner;
