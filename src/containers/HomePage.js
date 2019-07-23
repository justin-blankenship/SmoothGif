import React from "react";
import { Segment, Divider } from "semantic-ui-react";
import ConvertVideo from "./ConvertVideoPage";
import ConvertImages from "./ConvertImagesPage";
import { styles } from "../assets/styles";
import { Button, Col, Image, Grid, Row } from 'react-bootstrap';


class HomePage extends React.Component {
  //Constructor for Homepage sets initial states and props.
  constructor(props) {
    super(props);
    this.state = {
      showVideoScreen: false,
      showImagesScreen: false
    };
  }

  //sets state of showVideoScreen for use by render method.
  setShowVideoScreen() {
    this.setState({ showVideoScreen: true });
  }

  //sets state of showImagesScreen for use by render method.
  setShowImagesScreen() {
    this.setState({ showImagesScreen: true });
  }

  /*
  Displays button group, the initial state.
  Only displays if one of the buttons hasn't been pressed.
  */
  displayButtonGroup() {
    //If neither button has been pressed.
    if (
      this.state.showVideoScreen == false &&
      this.state.showImagesScreen == false
    ) {
      return (
        <div>
          
          <div>
            <Image style={styles.logo} responsive src="assets/logo2.png"/>
          </div>
          
          <Grid>
            <Row className="text-center"><h1 style={styles.container}>Choose Source</h1></Row>
          </Grid>
          
          <Segment padded>
            
            <Button bsStyle="primary" block bsSize="large" onClick={this.setShowVideoScreen.bind(this)}>
              Convert Video
            </Button>
            
            <Divider horizontal>Or</Divider>
            
            <Button bsStyle="success" block bsSize="large" onClick={this.setShowImagesScreen.bind(this)}>
              Convert Images
            </Button>

          </Segment>

        </div>
      );
    }
  }

  //Displays 'ConvertVideoPage' component if 'Convert Video' button has been pressed.
  displayVideoScreen() {
    if (
      this.state.showVideoScreen == true &&
      this.state.showImagesScreen == false
    ) {
      return <ConvertVideo />;
    }
  }

  //Displays 'ConvertImagesPage' component if 'Convert Images' button has been pressed.
  displayImagesScreen() {
    if (
      this.state.showVideoScreen == false &&
      this.state.showImagesScreen == true
    ) {
      return <ConvertImages />;
    }
  }

  /*
  HomePage Render Method. Displays components depending on the state of the application.
  */
  render() {
    return (
      <div style={styles.container}>
        {this.displayButtonGroup()}
        {this.displayVideoScreen()}
        {this.displayImagesScreen()}
      </div>
    );
  }
}

export default HomePage;
