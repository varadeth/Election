
// import CSS. Webpack with deal with it
import "../css/style.css"

// Import libraries we need.
import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"


import votingArtifacts from "../../build/contracts/Voting.json"
var VotingContract = contract(votingArtifacts)


window.App = {
  // called when web3 is set up
  calculateTime : function() {
    var countDownDate = new Date("May 25, 2019 00:00:00").getTime();
    var now = new Date().getTime();
    var distance = countDownDate - now;
    if(distance < 0) {
      alert('Election period expired. Cannot Vote....!!!\n Sorry');
      var button = $("#countVotes")
      button.show();
    }
    else {
      App.check();
    }
  },
  start: function() { 
    // setting up contract providers and transaction defaults for ALL contract instances
    console.log('tejas');
    VotingContract.setProvider(window.web3.currentProvider)
    VotingContract.defaults({from: window.web3.eth.accounts[0],gas:6721975})

    // creates an VotingContract instance that represents default address managed by VotingContract
    VotingContract.deployed().then(function(instance){

     
      instance.getNumOfCandidates().then(function(numOfCandidates){
        var button = $("#countVotes")
        var voteButton = $("#vote")
        voteButton.hide()
        var candidatebox = $("#candidatebox")
        candidatebox.hide()
        button.hide();
        $("#msg").html("")
        // adds candidates to Contract if there aren't any
        if (numOfCandidates == 0){
          
          instance.addCandidate("Candidate1","Democratic").then(function(result){ 
            $("#candidatebox").append(`<div class='form-check'><input class='form-check-input' type='radio' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=0>Candidate1</label></div>`)
          })
          instance.addCandidate("Candidate2","Republican").then(function(result){
            $("#candidatebox").append(`<div class='form-check'><input class='form-check-input' type='radio' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=1>Candidate1</label></div>`)
          })
          // the global variable will take the value of this variable
          numOfCandidates = 2 
        }
        else { // if candidates were already added to the contract we loop through them and display them
          for (var i = 0; i < numOfCandidates; i++ ){
            // gets candidates and displays them
            instance.getCandidate(i).then(function(data){
              $("#candidatebox").append(`<div class="form-check"><input class="form-check-input" type="radio" value="" id=${data[0]} name = "candidates"><label class="form-check-label" for=${data[0]}>${window.web3.toAscii(data[1])}</label><label class = "form-check-label" for=${data[0]}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label><label class="form-check-label" for=${data[0]}>${window.web3.toAscii(data[2])}</label></div>`)
            })
          }
        }
        // sets global variable for number of Candidates
        // displaying and counting the number of Votes depends on this
        window.numOfCandidates = numOfCandidates 
      })
    }).catch(function(err){ 
      console.log('2');
      console.error("ERROR! " + err.message)
    })
  },

  login: function() {
    var xhttp = new XMLHttpRequest();
    if(xhttp.readyState==0||xhttp.readyState==0) {
      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;
      console.log(username+'\n'+password);
      xhttp.open('POST','http://192.168.43.142:3000/login.html?username='+username+'&password='+password,true);
      xhttp.onreadystatechange = function() {
        if(this.readyState==4&&this.status==200) {
          var response = xhttp.responseText;
          if(response=='ERROR') {
            console.log(response);
            document.getElementById('logonFailedMessage').innerHTML = 'Incorrect Username/Password';
          }
          else if(response=='ADMIN'){
            console.log('admin.html');
            window.location.href='admin.html';
          }
          else {
            window.location.href = 'vote.html';
          }
        }
      }
      xhttp.send();
    }
  },
  check: function() {
    VotingContract.deployed().then(function(instance){
      $("#msg").html("")
      var number = $("#idinput").val()
      var voteButton = $("#vote")
      var candidatebox = $("#candidatebox")
      instance.voted(number).then(function(voter){
        if(!voter)
        {
          voteButton.show()  
          candidatebox.show()
          var check = $("#isEligible")
          check.hide()
        }
        else {
          $("#msg").html("Already Voted")
        }
      });
      console.warn(instance.voted(number))
      return
    }).catch(function(error){
      console.warn(error)
    })
  },
  // Function that is called when user clicks the "vote" button
  vote: function() {
    var uid = $("#idinput").val() //getting user inputted id

    // Application Logic 
    if (uid == ""){
      $("#msg").html("<p>Please enter id.</p>")
      return
    }
    // Checks whether a candidate is chosen or not.
    // if it is, we get the Candidate's ID, which we will use
    // when we call the vote function in Smart Contracts
    if ($("#candidatebox :radio:checked").length > 0){ 
      // just takes the first checked box and gets its id
      var candidateID = $("#candidatebox :radio:checked")[0].id
    } 
    else {
      // print message if user didn't vote for candidate
      $("#msg").html("<p>Please vote for a candidate.</p>")
      return
    }
    // Actually voting for the Candidate using the Contract and displaying "Voted"
    VotingContract.deployed().then(function(instance){
      instance.vote(uid,parseInt(candidateID)).then(function(result){
        $("#msg").html("<p>Voted</p>")
        var voteButton = $("#vote")
        voteButton.hide()
        console.warn(result)
      })
    }).catch(function(err){ 
      console.error("ERROR! " + err.message)
    })
  },

  // function called when the "Count Votes" button is clicked
  findNumOfVotes: function() {
    VotingContract.deployed().then(function(instance){
      // this is where we will add the candidate vote Info before replacing whatever is in #vote-box
      var box = $("<section></section>") 

      // loop through the number of candidates and display their votes
      for (var i = 0; i < window.numOfCandidates; i++){
        // calls two smart contract functions
        var candidatePromise = instance.getCandidate(i)
        var votesPromise = instance.totalVotes(i)

        // resolves Promises by adding them to the variable box
        Promise.all([candidatePromise,votesPromise]).then(function(data){
          box.append(`<p>${window.web3.toAscii(data[0][1])}: ${data[1]}</p>`)
        }).catch(function(err){ 
          console.error("ERROR! " + err.message)
        })
      }
      $("#vote-box").html(box) // displays the "box" and replaces everything that was in it before
    })
  },
  addCandidates: function() {
    VotingContract.setProvider(window.web3.currentProvider)

    window.web3.eth.defaultAccount = '0x7063E6683c799dFEBAC0a75D95143640B50b785B';
    VotingContract.deployed().then(function(instance) {
      instance.getNumOfCandidates().then(function(numberOfCandidates) {
        var candidateName = document.getElementById('candidateName').value;
        var party = document.getElementById('party').value;
        instance.addCandidate(candidateName,party).then(function(result){
          window.numOfCandidates += 1;
          alert('Done');
          window.location.href = "index.html";
        })
      })
    })
  }
}

// When the page loads, we create a web3 instance and set a provider. We then set up the app
window.addEventListener("load", function() {
  // Is there an injected web3 instance?
  if (typeof web3 !== "undefined") {
    console.warn("Using web3 detected from external source like Metamask")
    // If there is a web3 instance(in Mist/Metamask), then we use its provider to create our web3object
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.43.142:7545"))
  }
  // initializing the App
  window.App.start()
})