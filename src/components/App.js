import React, {Component} from 'react';
import Web3 from 'web3';
import './App.css';
import File from '../abis/File.json';
import {ToastsContainer, ToastsStore} from 'react-toasts';
//let CryptoJS = require("crypto-js");



let count=0;
let encrypted;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            authenticated: '',
            contract: null,
            status: "Not Uploaded",
            patientName: '',
            patientStatus: '',
            patientID: '',
            data: '',
            students: [],
            password: '',
            count: 0
        }
    }

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockChainData();
        await this.fetchData();
    }

    async loadBlockChainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({account: accounts[0]});
        const networkId = await web3.eth.net.getId();
        const networkData = File.networks[networkId];
        if (networkData) {
            const abi = File.abi;
            const address = networkData.address;
            // Fetch smart contract
            const contract = web3.eth.Contract(abi, address);
            this.setState({contract});
        } else {
            window.alert('Smart contract not deployed to detected network');
        }
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('Please install MetaMask!')
        }
    }

    updateName = (e) => {
        e.preventDefault();
        this.setState({patientName: e.target.value});
    };


    updateStatus = (e) => {
        e.preventDefault();
        this.setState({patientStatus: e.target.value});
    };

    updateID = (e) => {
        e.preventDefault();
        this.setState({patientID: e.target.value});
    };

    updatePassword = (e) => {
        e.preventDefault();
        this.setState({password: e.target.value});
    };

    onSubmit = (e) => {
        e.preventDefault();
        let name = this.state.patientName;
        let ID = this.state.patientID;
        let status = this.state.patientStatus;
        this.state.data = this.state.data + name + "-" + ID + "-" + status + ":";
        //encrypted =CryptoJS.AES.encrypt(this.state.data, '123wredfsdf').toString();
        //console.log(encrypted);
        ToastsStore.warning("Adding data to Blockchain...");

        count= count+1;
        // Store data on Blockchain
        this.state.contract.methods.set(this.state.data).send({from: this.state.account}).on("confirmation", (r) => {
            console.log("Data stored on Blockchain...");
            ToastsStore.success("Data stored successfully!");
        });
    };

    reset = () => {
        this.state.data = "";
        ToastsStore.warning("Resetting data...");

        // Reset data on Blockchain
        this.state.contract.methods.set(this.state.data).send({from: this.state.account}).on("confirmation", (r) => {
            console.log("Data reset on Blockchain...");
            ToastsStore.success("Data reset successfull!");
        });
    };

    fetchData = (e) => {
        if (e) {
            e.preventDefault();
        }
        this.state.contract.methods.get().call().then((v) => {
            console.log("Data fetched from Blockchain...");
            this.setState({data: v, status: "Data Loaded!"});
            console.log(this.state.data);
            ToastsStore.success("Data fetched successfully!");
        });
        this.updateData();
    };

    authenticate = (e) => {
        e.preventDefault();
        console.log("Authenticating...");

        if (this.state.password === "testing") {
            ToastsStore.success("You have logged in successfully!");
            this.setState({authenticated: true});
            console.log("Successfully authenticated!");
        } else {
            alert("Incorrect Password!");
            ToastsStore.error("Incorrect Password!");
        }
    };

    updateData = () => {
        //this.state.data= this.state.data+" ";
        let data;
        let i;
        let patientID_ = "Not Found";
        let patientCode_ = "Not Found";
        let patientStatus_ = "Not Found";
        //var bytes  = CryptoJS.AES.decrypt(encrypted, '123wredfsdf');
        //var originalText = bytes.toString(CryptoJS.enc.Utf8);

        try{
        data = this.state.data.split(":");
       
        this.state.students = this.state.data.split(":");
        
             let patientData = data[0].split("-");
                 patientID_ = patientData[0];
                  patientCode_ = patientData[1];
                  patientStatus_ = patientData[2];
                  //originalText=data[0];
    }
    catch(err)
    {
        console.log(data);
    }
        this.setState({patientID_, patientCode_, patientStatus_});
    };

    openPage(pageName,elmnt,color) {
        console.log("funvctionnnn.....");
        pageName="add";
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < tablinks.length; i++) {
           tablinks[i].style.backgroundColor = "";
        }
        if(pageName == null)
        {
        document.getElementById(pageName).style.display = "block";
        elmnt.style.backgroundColor = color;
        
        
        document.getElementById("defaultOpen").click();}
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0" 
                       target="_blank" rel="noopener noreferrer">
                        Admin Panel
                    </a>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white"><strong>Account
                                Connected:</strong> {this.state.account.length > 0 ? this.state.account : "Not Connected!"}
                            </small>
                        </li>
                    </ul>
                    <span className="nav-item text-nowrap">
                        <small className="text-white"><strong> Status:</strong> {this.state.status}&nbsp;&nbsp;</small>
                    </span>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <ToastsContainer store={ToastsStore}/>
                        <main role="main"  className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <br/>

                                {this.state.authenticated ?

                                    <div>
                            
                                    <div id="add">
                                        <form onSubmit={this.onSubmit}>
                                            <div className="form-group row">
                                                <label htmlFor="patientName"
                                                       className="col-sm-12 col-form-label">Patient Name:</label>
                                                <div className="col-sm-12">
                                                    <input type="text" className="form-control" id="patientName"
                                                       value={this.state.patientName} placeholder="Enter Patient Name!" required
                                                       onChange={this.updateName}/>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label htmlFor="PatientID"
                                                       className="col-sm-12 col-form-label">Patient ID:</label>
                                                <div className="col-sm-12">
                                                    <input type="text" className="form-control" id="patientID"
                                                       value={this.state.patientID} placeholder="Enter Patient ID!" required
                                                       onChange={this.updateID}/>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label htmlFor="testResult"
                                                   className="col-sm-12 col-form-label">Covid Test Result:</label>
                                                <div className="col-sm-12">
                                                    <input type="text" className="form-control" id="testResult"
                                                       value={this.state.patientStatus} placeholder="Enter Test Results!" required
                                                       onChange={this.updateStatus}/>
                                                </div>
                                            </div>

                                            <button type="button" onClick={this.onSubmit}
                                                className="premium-button">Submit
                                            </button>

                                            <button type="button" onClick={this.reset}
                                                className="premium-button">Reset Data
                                            </button>


                                        </form>
                                    </div>

                                    <div id="check">
                                        <form>
                                        <div className="form-group row">
                                            <label htmlFor="unitMarks"
                                                   className="col-sm-12 col-form-label">Search by Test ID:</label>
                                            <div className="col-sm-12">
                                                <input type="text" className="form-control" id="PID"
                                                        placeholder="Enter Test ID" required
                                                       />
                                            </div>
                                        </div>
                                        <button type="button" onClick={this.fetchData} className="premium-button">
                                                Display
                                        </button>
                                        <u1>
                                        {       
                                        
                                                this.state.students.map(function(item, i){
                                                    
                                                    if(item.length>1){
                                                        let patientData = item.split("-");
                                                        let patientName = patientData[0];
                                                        let patientID = patientData[1];
                                                        let patientStatus = patientData[2];
                                                        let id = document.getElementById("PID").value
                                                        if(patientID === id)
                                                        {
                                                        return <li key={i}>
                                                            <h2>Patient Name: {patientName}</h2>
                                                            <h2>Test ID: {patientID}</h2>
                                                            <h2>Covid Test Result: {patientStatus}</h2>
                                                        </li>
                                                        }
                                                        else
                                                        {
                                                            
                                                            if((i+1)>=count)
                                                            {
                                                                
                                                                return <h2> Not Found</h2>
                                                                        
                                                            }
                                                        }
                                                       
                                                    }
                                                    
                                                })

                                                
                                            }
                                            </u1>

                                        </form>

                                    </div>

                                    

                                    </div>
                                    
                                    :
                                    <div>
                                        <h2>Not Authenticated! </h2>
                                        <form onSubmit={this.authenticate}>
                                            <div className="form-group row">
                                            <label htmlFor="username"
                                                       className="col-sm-12 col-form-label">User Name:</label>
                                                <div className="col-sm-12">
                                                    <input type="text" className="form-control" id="username"
                                                            placeholder="Enter Username"
                                                           />
                                                </div>
                                                <label htmlFor="password"
                                                       className="col-sm-12 col-form-label">Password:</label>
                                                <div className="col-sm-12">
                                                    <input type="password" className="form-control" id="password"
                                                           value={this.state.password} placeholder="Enter Password"
                                                           onChange={this.updatePassword}/>
                                                </div>
                                            </div>
                                            <button type="button" onClick={this.authenticate}
                                                    className="premium-button">Submit
                                            </button>
                                        </form>
                                    </div>
                                    
                                    }
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
