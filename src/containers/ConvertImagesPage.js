import React from "react";
import gifshot from "gifshot";
import Slider from "react-rangeslider";
import fs from "fs";
import { Button, Grid, Image, Row } from "react-bootstrap";
import { Segment, Divider } from "semantic-ui-react";
import { styles } from "../assets/styles";

const dialog = require("electron").remote.dialog;

class ConvertImages extends React.Component {
  //Constructor for Convert Images sets default state and props.
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      gifObj: null,
      gifDuration: 2,
      gifWidth: 200,
      gifHeight: 200,
      readyToSave: false
    };
  }
  /*
  Open Electron dialog window and get local file paths of images.
  Sets local image paths to this.state.images
  */
  openImagesDialog() {
    dialog.showOpenDialog(
      {
        title: "Select Images",
        properties: ["multiSelections"],
        filters: [{ name: "Images", extensions: ["jpg", "png"] }]
      },
      function(filePaths) {
        console.log(filePaths);
        this.setState({ images: filePaths });
      }.bind(this)
    );
  }

  //Used by slider onChange to save desired duration of gif to state.
  handleGifDurationChange(value) {
    this.setState({
      gifDuration: value
    });
  }

  goBack() {
    if (this.state.images.length != 0 && this.state.readyToSave == false) {
      this.setState({
        images: [],
        gifObj: null,
        gifDuration: 2,
        gifWidth: 200,
        gifHeight: 200,
        readyToSave: false
      });
    } else {
      this.setState({
        readyToSave: false
      });
    }
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

  /*
    Uses user submitted data from state to create a gif.
    Stores created gif in state to this.state.gifObj and
    sets this.state.readyToSave to 'true'.
  */
  createGif() {
    let frameDuration = this.state.gifDuration * 10;
    gifshot.createGIF(
      {
        gifWidth: this.state.gifWidth,
        gifHeight: this.state.gifHeight,
        frameDuration: frameDuration,
        images: this.state.images
      },
      function(obj) {
        this.setState({
          gifObj: obj,
          readyToSave: true
        });
        console.log(this.state.gifObj);
      }.bind(this)
    );
  }
  /*
    Calls an electron save dialog to get file path to save the gif and save
    to this.state.saveLocation.
    Implements fs to write the file to this.state.saveLocation.
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
            //Finished
            dialog.showMessageBox({
              message: "Your Gif has been saved!",

              buttons: ["OK"]
            });
          });
        }.bind(this)
      );
    }
  }

  // Gets gifObj via this.state.gifObj and displays image with jsx.
  displayGif() {
    if (this.state.gifObj != null) {
      let gifRef = this.state.gifObj;
      let gifImg = gifRef.image;

      return (
        <div>
          <img src={gifImg} alt="gifImg" />
        </div>
      );
    }
  }

  //Displays Select Images button if this.state.images is empty.
  displayFileSelection() {
    if (this.state.images.length == 0) {
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
              <h1 style={styles.container}>Image to GIF</h1>
            </Row>
          </Grid>

          <Segment padded>
            <Button
              bsStyle="success"
              block
              bsSize="large"
              onClick={this.openImagesDialog.bind(this)}
            >
              Select Image Files
            </Button>
          </Segment>
        </div>
      );
    }
  }

  /*
    Checks state and determines if gif options should be displayed.
    Stores options in state for createGIF to use.
  */
  displayGifOptions() {
    if (this.state.images.length != 0 && this.state.readyToSave == false) {
      return (
        <div>
          <div className="durationSlider">
            <Slider
              min={1}
              max={5}
              value={this.state.gifDuration}
              onChange={this.handleGifDurationChange.bind(this)}
            />
            <div className="gifDurationValue">
              {"Duration: " + this.state.gifDuration + " s"}
            </div>
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
  Checks state and determines if save options needs to be returned.
  Button calls saveGif() to save to local machine.
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

  // Render method for the component. State determines what is display in each method.
  render() {
    return (
      <div>
        {this.displayFileSelection()}
        {this.displayGifOptions()}
        {this.displaySaveOptions()}
      </div>
    );
  }
}

export default ConvertImages;
