import React, { Component } from "react";
import DeleteBtn from "../components/DeleteBtn";
import EditBtn from "../components/EditBtn";
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem, ScreenBtn, PrintBtn, EmailBtn, TwBtn } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form"
import Nav from "../components/Nav";
import { withAuth } from '@okta/okta-react';



export default withAuth (class Admin extends Component {
  constructor(props) {
   super(props);
   this.state = {
    authenticated: null,
    _id: '', //shindata id 
    shinbay: [],
    title: "",
    description: "",
  
  };
}
  checkAuthentication = async () => {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }; 

  async componentDidMount() {
    this.checkAuthentication();
    this.loadAdmin();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  login = async () => {
    this.props.auth.login('/');
  };

  logout = async () => {
    this.props.auth.logout('/');
  };


  loadAdmin = () => {
    API.getAdmin()
      .then(res =>
        this.setState({ shinbay: res.data, title: "", description: "" })
      )
      .catch(err => console.log(err));
  };

  deleteShindata = id => {
    API.deleteShindata(id)
      .then(res => this.loadAdmin())
      .catch(err => console.log(err));
  };

  showEditShindata = (id, title, description) => {
    this.setState({ _id: id, title: title, description: description });
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    console.log(name, value);
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    const { title, description, _id } = this.state;
    if (title && description && _id) {
      let shindataData = {
        _id,
        title,
        description,
      }
      API.editShindata(shindataData)
        .then(res => this.loadAdmin())
        .catch(err => console.log(err));
        this.setState({_id: ''})
    } else {
      API.saveShindata({
        title: this.state.title,
        description: this.state.description,
        //         synopsis: this.state.synopsis
      })
        .then(res => this.loadAdmin())
        .catch(err => console.log(err));
    }
  };

  render() {
    if (this.state.authenticated === null) return null;
    const mainContent = this.state.authenticated ? (    
  
      <Container fluid>
        <Nav> </Nav>
        <br />
        <button className="btn btn-dark btn-lg" onClick={this.logout}>
              Logout
            </button>
          <br/>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>Add Menu</h1>
            </Jumbotron>
            <form>
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                name="title"
                placeholder="Name (required)"
              />
              <TextArea
                value={this.state.description}
                onChange={this.handleInputChange}
                name="description"
                placeholder="Description (required)"
              />

              <FormBtn
                disabled={!(this.state.description && this.state.title)}
                onClick={this.handleFormSubmit}
              >
                Submit Menu
              </FormBtn>
            </form>
            <br /><br />
            <Jumbotron>
              <h1>Menu List</h1>
            </Jumbotron>

            {this.state.shinbay.length ? (
              <List>
                {this.state.shinbay.map(shindata => (
                  <ListItem key={shindata._id}>
                    {/* <Link to={"/shinbay/" + shindata._id}> */}
                    <strong>
                      {shindata.title}
                    </strong>
                    <p>
                      {shindata.description}
                    </p>
                    {/* </Link> */}
                    <DeleteBtn onClick={() => this.deleteShindata(shindata._id)} />
                    <EditBtn onClick={() => this.showEditShindata(shindata._id, shindata.title, shindata.description)} />
                  </ListItem>
                ))}
              </List>
            ) : (
                <p>No Results to Display</p>
              )}
          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Menu Preview</h1>
            </Jumbotron>
            {this.state.shinbay.length ? (
              <List>
                {this.state.shinbay.map(shindata => (
                  <ListItem key={shindata._id}>

                    <strong>
                      {shindata.title}
                    </strong>
                    <p>
                      {shindata.description}
                    </p>

                  </ListItem>
                ))}
              </List>

            ) : (
                <p>No Results to Display</p>

              )}


            <Link to={"/view"}>
              <ScreenBtn>
                Screen View
		</ScreenBtn>
            </Link>

            <Link to={"/print"}>
              <PrintBtn>
                Print
		</PrintBtn>
            </Link>

            <EmailBtn>
              Send Email
	</EmailBtn>

            <TwBtn>
              Facebook
	</TwBtn >
          </Col>

        </Row>
      </Container>
      ):(
        <div>
            <p className="lead">
              If you are a staff member, please get your credentials from your
              supervisor
            </p>
            <button className="btn btn-dark btn-lg" onClick={this.login}>
              Login
            </button>
          </div>
      );
      return (
        <div>
          {mainContent}
        </div>
    );
  }
}
)

