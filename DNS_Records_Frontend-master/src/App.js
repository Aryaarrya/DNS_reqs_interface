import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';


// Sand Tan: #e1b382

// Sand Tan Shadow: #c89666

// Night Blue: #2d545e

// Night Blue Shadow: #12343b
/* A, AAAA, TXT, MX and NS. */


//Fatima
function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          DNS Query OutPut
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
       <div>{props.Result}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
}
//Fatima

class App extends React.Component {

  constructor(props) {
    super(props);
    //Pragya
    this.state = {
      NameServer:"",
      Resource : "",
      Type: "A",
      SourceIP: "",
      ReverseDNS: false,
      ReverseIP:"",
      IPVersion: "IPv4 or IPv6",
      Recursion: true,
      Protocol: "Use default value",
      Tracing: false,
      Shorten: false,
      PortNumber: "",
      TimeOut: 5,
      NumTries: 3,
      Result : "",
      modalShow : false 
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  setModalShow = (value) => {
    this.setState({modalShow : value}) ;
  }


  handleChange(event) {
    const target = event.target;
    var value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name==='Recursion') {    //Recursion check is for disabling recursion that's why negative the value of Whether Checked or not
      console.log(value);
      value = !value;
      console.log(value);
    }

    if (target.type === 'dropdown') {  //Different way to access the value of the Dropdown
      value = target.value;
      console.log(target);
    }

    console.log(target,value,name);

    this.setState({
      [name]: value
    });
  }
  //Pragya

  //Arya
  async handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.NameServer);
    console.log(event);
    console.log(this.state);
    let name = this.state.NameServer==="" ? " " : this.state.NameServer ;
    let resourse = this.state.Resource==="" ? " " : this.state.Resource ;
    let type = this.state.Type ;
    let sourceip = "-b "+ this.state.SourceIP ;
    let reversedns = this.state.ReverseDNS ? "true" : "false"  ;
    // if reversedns is true then 
    let reverseip = this.state.ReverseDNS ? "-x "+this.state.ReverseIP : " " ;
    let ipversion = (this.state.IPVersion==="IPv4")? "-4" : (this.state.IPVersion==="IPv6")? "-6" : " " ;
    let recursion = this.state.Recursion ? " " : "+norecurse" ;
    let protocol = (this.state.Protocol==="Use TCP only")? "+tcp" : (this.state.Protocol==="Don't use TCP")? "+notcp" : " " ;
    let tracing = this.state.Tracing ? "+trace" : " ";
    let shorten = this.state.Shorten ? "+short" : " ";
    let port = "-p "+this.state.PortNumber ;
    let timeout = "+time="+this.state.TimeOut ;
    let numtries = "+tries="+ this.state.NumTries;
    this.setModalShow(true);
    this.setState({Result : "Loading...."});


    await axios.get('/'+name+'/'+resourse+'/'+type + '/'+sourceip+ '/'+reversedns + '/'+reverseip+'/'+ipversion+'/'+recursion+'/'+protocol+'/'+tracing+'/'+shorten+'/'+port +'/'+timeout +'/'+numtries )
      .then(res => {
        var ans = res.data.split("\n") ;
        var Result = [];
        for (let i=0 ; i<ans.length ; i++){
          if (ans[i][0] !== ';') {  //first char as ; signifies a header line
            Result.push(<p key={i}>{ans[i]}</p>);
          }
        }
        this.setState({
          Result : Result 
        });
        console.log();
      })
      .catch(err => {
        this.setState({
          Result : err 
        });
        console.log(err);
      }
        )
  //Arya    
    
  }

  handleDrop(event) {
    console.log(this.state);
  }

  render(){
    //basic HTML, Tarun, and onSubmit onChange handlers and values associated Pragya
    return (
      <div className="App">
      <MyVerticallyCenteredModal  show={this.state.modalShow} onHide={() => this.setModalShow(false)} Result={this.state.Result} />
        <Navbar>
          <Navbar.Brand href="/">
            <img
              alt=""
              src="https://cdn2.iconfinder.com/data/icons/database-and-servers-1/100/data_server_databasedb_hosting-512.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}res
            Fetch DNS Records
          </Navbar.Brand>
        </Navbar>

        <div className="desc">
          <div className="Jumbo">
            <Container>
              <h1>DNS Records</h1>
              <p>
                Fetch DNS Records and choose the options from given below Dropdowns and CheckBoxes and hit Submit!
              </p>
            </Container>
          </div>
        </div>

        <div className="header">

          <Form className='line'>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Name Server</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    name="NameServer"
                    type="text"
                    onChange={this.handleChange}
                    placeholder="Name or IP address of the name server to query"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} controlId="formGrdiEmail">
                <Form.Label>Resource Name</Form.Label>
                <Form.Control 
                    name="Resource"
                    type="text"
                    onChange={this.handleChange}
                    placeholder="Name of the Resource Record to be looked up" />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Type of DNS Records</Form.Label>
                <InputGroup className="mb-3">
                  <select name="Type" value={this.state.value} onChange={this.handleChange}>
                    <option value="A">A</option>
                    <option value="AAAA">AAAA</option>
                    <option value="NS">NS</option>
                    <option value="TXT">TXT</option>
                    <option value="CNAME">CNAME</option>
                    <option value="MX">MX</option>
                    <option value="ANY">ANY</option>
                  </select>
                  <FormControl placeholder="Default is A record" aria-describedby="basic-addon1" readOnly/>
                </InputGroup>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Source IP Address</Form.Label>
                <Form.Control 
                    type="text" 
                    name="SourceIP"
                    onChange={this.handleChange} 
                    placeholder="Valid address on your network, default is 0.0.0.0"/>
              </Form.Group>

              <Form.Group as={Col} id="formGridCheckbox">
                  <Form.Label>Reverse DNS Lookup</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Checkbox name="ReverseDNS" type="checkbox" onChange={this.handleChange} aria-label="Checkbox for following text input"/>
                    </InputGroup.Prepend>
                    <Form.Control 
                      name="ReverseIP"
                      type="text"
                      onChange={this.handleChange} 
                      placeholder="IP Address of DNS Server for Reverse DNS Lookup" 
                      aria-describedby="basic-addon1"/>
                  </InputGroup>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>IP Version</Form.Label>
                <InputGroup className="mb-3">
                    <select name="IPVersion" value={this.state.value} onChange={this.handleChange}>
                      <option value="IPv4 or IPv6">IPv4 or IPv6</option>
                      <option value="IPv4">IPv4</option>
                      <option value="IPv6">IPv6</option>
                    </select>
                  <FormControl placeholder="Only use IPv4 or IPv6 query transport" aria-describedby="basic-addon1" readOnly/>
                </InputGroup>
              </Form.Group>
            </Form.Row>

            <Form.Row>
    
              <Form.Group as={Col} id="formGridCheckbox">
                  <Form.Label>Disable Recursion</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Checkbox name="Recursion" type="checkbox" onChange={this.handleChange} aria-label="Checkbox for following text input" />
                    </InputGroup.Prepend>
                    <Form.Control placeholder="'dig' normally sends recursive queries" aria-describedby="basic-addon1" readOnly/>
                  </InputGroup>
              </Form.Group>
              
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Protocol for sending query requests</Form.Label>
                <InputGroup className="mb-3">
                    <select className="dropdown" name="Protocol" value={this.state.value} onChange={this.handleChange}>
                      <option value="Use default value">Use default value</option>
                      <option value="Use TCP only">Use TCP only</option>
                      <option value="Don't use TCP">Don't use TCP</option>
                    </select>
                  <FormControl placeholder="Default is UDP unless an AXFR or IXFR Query is made" aria-describedby="basic-addon1" readOnly/>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} id="formGridCheckbox">
                  <Form.Label>Enable tracing</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Checkbox name="Tracing" type="checkbox" onChange={this.handleChange} aria-label="Checkbox for following text input" />
                    </InputGroup.Prepend>
                    <Form.Control placeholder="Iterative Queries, follow referrals from root server" aria-describedby="basic-addon1" readOnly/>
                  </InputGroup>
              </Form.Group>
            </Form.Row>

            <Form.Row>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Port Number</Form.Label>
                <Form.Control 
                    name="PortNumber"
                    type="number"
                    onChange={this.handleChange}
                    placeholder="Standard Port number is 53"/>
                {/* <Form.Control as="select" defaultValue="Choose...">
                  <option>Choose...</option>
                  <option>...</option>
                </Form.Control> */}
              </Form.Group>

              <Form.Group as={Col} id="formGridCheckbox">
                  <Form.Label>Shorten the response</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Checkbox name="Shorten" type="checkbox" onChange={this.handleChange} aria-label="Checkbox for following text input" />
                    </InputGroup.Prepend>
                    <Form.Control placeholder="Provide a terse answer." aria-describedby="basic-addon1" readOnly/>
                  </InputGroup>
              </Form.Group>
              
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>TimeOut for a Query</Form.Label>
                <Form.Control name="TimeOut"
                    onChange={this.handleChange} type="number" placeholder="Enter timeout T in seconds (minimum 1 sec)" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Number of Tries for a Query</Form.Label>
                <Form.Control name="NumTries"
                    onChange={this.handleChange} type="number" placeholder="Default is 3 UDP tries, enter the number of tries" />
              </Form.Group>
            </Form.Row>
            
              <Button as={Col} variant="outline-dark" type="submit" onClick={this.handleSubmit}>Submit</Button>
          </Form>

          
        </div>
      </div>
    );
  }
}

export default App;