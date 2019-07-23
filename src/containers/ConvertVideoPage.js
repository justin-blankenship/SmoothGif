import React from "react";
import gifshot from "gifshot";
import ReactPlayer from "react-player";
import Slider from "react-rangeslider";
import { Button, Grid, Image, Row } from "react-bootstrap";
import { Segment, Divider } from "semantic-ui-react";
import { styles } from "../assets/styles";

const dialog = require("electron").remote.dialog;
var fs = require("fs");

// Constructor sets initial state for the component.
class ConvertVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetLocation: null,
      gifObj: null,
      readyToSave: false,
      saveLocation: null,
      playing: true,
      volume: 0.8,
      muted: true,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      loop: true,
      gifDuration: 2,
      gifStartTime: 0,
      gifHeight: 200,
      gifWidth: 200
    };
  }

  //Creates a reference to the video player so functions can be called on this.player
  ref(player) {
    this.player = player;
  }

  //Helper function to set state of this.state.duration for use by the video player.
  onDuration(duration) {
    console.log("onDuration", duration);
    this.setState({ duration });
  }

  //Used by slider onChange to save desired duration of gif to state.
  handleGifDurationChange(value) {
    this.setState({
      gifDuration: value
    });
  }

  //Used by slider onChange to save desired start time of gif to state.
  handleGifStartTimeChange(value) {
    this.setState({ played: value, gifStartTime: value });
    this.player.seekTo(value);
  }

  //Called by input box onChange to save width of gif to state.
  handleWidthChange(value) {
    this.setState({ gifWidth: value.target.value });
  }

  //Called by input box onChange to save height of gif to state.
  handleHeightChange(value) {
    this.setState({ gifHeight: value.target.value });
    console.log(this.state.gifHeight);
  }

  //Set this.state.readyToSave to true to determine if save options should be displayed
  changeReadyToSave() {
    this.setState({ readyToSave: true });
  }

  goBack() {
    if (this.state.assetLocation != null && this.state.readyToSave == false) {
      this.setState({
        assetLocation: null,
        gifObj: null,
        readyToSave: false,
        saveLocation: null,
        playing: true,
        volume: 0.8,
        muted: true,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: true,
        gifDuration: 2,
        gifStartTime: 0,
        gifHeight: 200,
        gifWidth: 200
      });
    } else {
      this.setState({
        readyToSave: false
      });
    }
  }

  /*
    Opens an electron dialog to get path to .mp4 file for gif conversion
    Sets this.state.assetLocation to file path.
  */
  openAssetLocationDialog() {
    dialog.showOpenDialog(
      {
        title: "Select mp4 Video to Convert",
        properties: ["openFile"],
        filters: [{ name: "Movies", extensions: ["mp4"] }]
      },
      function(fileName) {
        this.setState({ assetLocation: fileName.toString() });
        console.log(this.state.assetLocation);
      }.bind(this)
    );
  }

  /*
    Uses this.state.assetLoation to create a gif with the GifShot library.
    Uses users input, stored in state, for needed props.
    Saves the gif image to this.state.gifObj.
  */
  createGif() {
    let numFrames = this.state.gifDuration / 0.1;
    gifshot.createGIF(
      {
        gifWidth: this.state.gifWidth,
        gifHeight: this.state.gifHeight,
        video: this.state.assetLocation,
        offset: this.state.gifStartTime,
        numFrames: numFrames,
        saveRenderingContexts: true
      },
      function(obj) {
        // Save gifObj to state and set readyToSave to true
        this.setState({
          gifObj: obj,
          readyToSave: true
        });
        console.log(this.state.gifObj);
      }.bind(this)
    );
  }

  // Gets this.state.gifObj and displays the gif in jsx.
  displayGif() {
    if (this.state.gifObj != null) {
      let gifRef = this.state.gifObj;
      let gifImg = gifRef.image;

      return (
        <div>
          <img style={styles.createdGif} src={gifImg} alt="gifImg" />
        </div>
      );
    }
  }

  /*
    Use's electron dialog to get path to save location from user.
    Implements fs to write file to local machine to this.state.saveLocation.
  */
  saveGif() {
    if (this.state.gifObj != null) {
      let gifImageObjRef = this.state.gifObj.image;
      let imageData = gifImageObjRef.replace(/^data:image\/\w+;base64,/, "");

      console.log(typeof gifImage);

      dialog.showSaveDialog(
        {
          filters: [{ name: "Images", extensions: ["gif"] }]
        },
        function(fileName) {
          this.setState({ saveLocation: fileName.toString() });
          console.log(this.state.saveLocation);

          fs.writeFile(fileName, imageData, { encoding: "base64" }, function(
            err
          ) {
            //Finished saving, show dialogs
            dialog.showMessageBox({
              message: "Your Gif has been saved!",

              buttons: ["OK"]
            });
          });
        }.bind(this)
      );
    }
  }
  // Creates button for saving asset locaton. onClick opens dialog box.
  displayFileSelection() {
    if (this.state.assetLocation == null && this.state.gifObj == null) {
      return (
        <div className="well">
          <Image
            style={styles.logo}
            responsive
            src="assets/logo2.png"
            responsive
          />

          <Grid>
            <Row className="text-center">
              <h1 style={styles.container}>MP4 to GIF</h1>
            </Row>
          </Grid>

          <Segment padded>
            <Button
              bsStyle="primary"
              block
              bsSize="large"
              onClick={this.openAssetLocationDialog.bind(this)}
            >
              Select Video File
            </Button>
          </Segment>
        </div>
      );
    }
  }
  /*
    Checks state to determine if video options should be displayed.
    Uses ReactPlayer
  */
  displayVideoOptions() {
    if (this.state.assetLocation != null && this.state.readyToSave == false) {
      return (
        <div style={styles.videoWrapper}>
          <div className="player-wrapper">
            <ReactPlayer
              ref={this.ref.bind(this)}
              className="react-player"
              style={styles.videoPreview}
              width="100%"
              url={this.state.assetLocation}
              playing={this.state.playing}
              playbackRate={this.state.playbackRate}
              volume={this.state.volume}
              loop={this.state.loop}
              muted={this.state.muted}
              onError={e => console.log("onError", e)}
              onDuration={this.onDuration.bind(this)}
              controls={true}
            />
          </div>
          <div className="durationSlider">
            <Slider
              min={1}
              max={15}
              value={this.state.gifDuration}
              onChange={this.handleGifDurationChange.bind(this)}
            />
            <div className="gifDurationValue">
              {"Duration: " + this.state.gifDuration + " s"}
            </div>
          </div>

          <div className="StartTimeSlider">
            <Slider
              min={0}
              max={this.state.duration}
              value={this.state.played}
              onChange={this.handleGifStartTimeChange.bind(this)}
            />
          </div>
          <div className="gifDurationValue">
            {"Start Time: " + this.state.gifStartTime + " s"}
          </div>

          <div className="sizeOptions">
            <label>
              Height:
              <input
                type="text"
                value={this.state.gifHeight}
                onChange={this.handleHeightChange.bind(this)}
              />
            </label>
            <label>
              Width:
              <input
                type="text"
                value={this.state.gifWidth}
                onChange={this.handleWidthChange.bind(this)}
              />
            </label>
          </div>

          <Segment padded>
            <Button
              bsStyle="success"
              block
              bsSize="large"
              onClick={this.createGif.bind(this)}
            >
              Create GIF
            </Button>

            <Divider horizontal>Or</Divider>

            <Button
              bsStyle="danger"
              block
              bsSize="large"
              onClick={this.goBack.bind(this)}
            >
              Go Back
            </Button>
          </Segment>
        </div>
      );
    }
  }
  /*
    Gives user the option to save the gif.
    Check state to determine if gif object has been created then show button for saving.
   */
  displaySaveOptions() {
    if (this.state.readyToSave == true) {
      let gifRef = this.state.gifObj;
      let gifImg = gifRef.image;

      return (
        <div>
          <div className="gifPreview">
            <img style={styles.createdGif} src={gifImg} alt="gifImg" />
          </div>

          <Segment padded>
            <Button
              bsStyle="primary"
              block
              bsSize="large"
              onClick={this.saveGif.bind(this)}
            >
              Save GIF
            </Button>

            <Divider horizontal>Or</Divider>

            <Button
              bsStyle="danger"
              block
              bsSize="large"
              onClick={this.goBack.bind(this)}
            >
              Go Back
            </Button>
          </Segment>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.displayFileSelection()}
        {this.displayVideoOptions()}
        {this.displaySaveOptions()}
      </div>
    );
  }
}

export default ConvertVideo;
