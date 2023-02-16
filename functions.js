async function fetchHackathons() {
  const response = await fetch('https://kontests.net/api/v1/all');
  const data = await response.json();
 // console.log(data);
  return data;
};

async function getSites(){
  const allSites = await fetch("https://kontests.net/api/v1/sites")
  const siteData = await allSites.json()
  return siteData;
}

function displayAmount(amt){
  hackathonAmount.innerHTML = `Browse Hackathons from ${amt} different sites`;
}

function displaySites(data){
  data.forEach(element =>{
  siteHolder.innerHTML = siteHolder.innerHTML +  ` <a class="navbar-item option2">${element[0]}</a>`;
  });
}

function displayHackathons(list) {
  cardHolder.innerHTML = "";
  errorHolder.innerHTML = "";

  list.forEach(element => {
    let name = checkForBlank(element.name);
    let link = checkForBlank(element.url);
    let site = checkForBlank(element.site);
    let in24 = checkForBlank(element.in_24_hours);
    let status = checkForBlank(element.status);
    let start = checkForBlank(element.start_time);
    let end = checkForBlank(element.end_time);
    let duration = getCurrentDuration(start, end);

    cardHolder.innerHTML = cardHolder.innerHTML +

      `<div class="card cardDetail">
    <div class="card-content">
      <p class="title">
        ${name} 
      </p>
      <p class="subtitle duration" style="color:#4d608f;" data-time = ${duration[1]}, data-status = ${duration[0]} ${"Ending"} data-endUTC = ${end}>
        ${site} - ${codingOrBefore(status)}
      <br> <br>
         ${duration[0]} in: ${formatTime(duration[1])}
      <p>
        ${formatDate(start)} - ${formatDate(end)}
      </p>
    </div>
    <footer class="card-footer">
      <p class="card-footer-item">
        <a href="${link}" target="_blank">
          <button class="button is-info zoom">View
          </button>
        </a>
      </p>
    </footer>
  </div>`;            
                                                                            
  });
  if (list.length === 0) {
    errorHolder.innerHTML = `<p class='centerError'>No results found with criteria... <br> Status: ${codingOrBefore(runStatus)}<br> Starts in 24 hours: ${in24} <br> Number of Sites: ${returnNumSites(listOfSites)} </p>`;
  }
}


function checkForBlank(str){
  if (str.length <= 1){
    return "Unknown";
  }
  return str;
}

function formatTime(secondsInput) {
  // Outputs time in seconds to days:hours:mintues:seconds
  let days, hours, mintues, seconds
  days = (Math.floor(secondsInput / 86400)).toString().padStart(2, "0");
  secondsInput %= 86400;
  hours = (Math.floor(secondsInput / 3600)).toString().padStart(2, "0");
  secondsInput %= 3600;
  mintues = ("" + Math.floor(secondsInput / 60)).padStart(2, "0");
  seconds = (secondsInput % 60).toString().padStart(2, "0");
  return `${days} : ${hours} : ${mintues} : ${seconds}`
}

function formatDate(UTCString) {
  let date = new Date(UTCString)
  return `${date.toDateString()}  ${date.toLocaleTimeString()}`
}

function codingOrBefore(CB) {
  if (CB === "CODING")
    return ("Currently running");
  if (CB === "BEFORE")
    return ("Not started");
  else {
    return "either";
  }
}

function returnNumSites(array) {
  if (array.length === 0 || array.length === 11)
    return "All sites"
  let r = `${array.length} site`
  if (array.length > 1)
     r= r + "s"
  return r
}

function getCurrentDuration(startUTC, endUTC) {
  let startDate = new Date(startUTC);
  let startDateTime = Math.floor(startDate.getTime() / 1000)

  let endDate = new Date(endUTC);
  let endDateTime = Math.floor(endDate.getTime() / 1000)

  let curTime = Math.floor(Date.now() / 1000);
  if (startDateTime > curTime) {
    return ["Starting", (startDateTime - curTime)]
  }
  else {
    return ["Ending", (endDateTime - curTime)];
  }
}

function decrementDuration() {
  cardDurations = document.querySelectorAll(".duration")
  cardDurations.forEach(element => {
    // Decreases the dataset time by 1
    element.dataset.time = parseInt(element.dataset.time) - 1;
    // Find index of breakline to seprate the name and 
    let index = element.innerHTML.search("<br>")
    // Replaces innerHTML with part before the <br> then adds the upadted time to it
    element.innerHTML = element.innerHTML.substring(0, index) + "<br>" + "<br>" + element.dataset.status + " in: " + formatTime(element.dataset.time)


    //Sees if timer expired
    if (element.dataset.time <= 0) {
      if (element.dataset.status === "Ending") { //If ending say it competion is done
        element.innerHTML = element.innerHTML.replace("Currently running", "Competion Over")
        element.innerHTML = element.innerHTML.substring(0, element.innerHTML.search("<br>") + 4)
      }
      else {
        //If not update dataset and restart timer
        element.dataset.status = "Starting"
        element.dataset.time = getCurrentDuration(0, element.dataset.endutc)[1]
        element.dataset.status = "Ending"
        element.innerHTML = element.innerHTML.replace("Not started", "Currently running")
      }
    }

  })


}

function onOption0Click() {
  if (this === options0[0]) {
    // Check if first option is clicked if yes sets to either
    if (options0[0].classList.contains("has-background-success")) {
      options0[0].classList.remove("has-background-success")
      runStatus = "either"
    }
    // If not sets background green and runStatus to coding then darkens second option if needed
    else {
      options0[0].classList.add("has-background-success")
      runStatus = "CODING"
      if (options0[1].classList.contains("has-background-success"))
        options0[1].classList.remove("has-background-success")
    }
  }
  else if (this === options0[1]) {
    // Check if second option is clicked if yes and is clicked sets to either
    if (options0[1].classList.contains("has-background-success")) {
      options0[1].classList.remove("has-background-success")
      runStatus = "either"
    }
    else { // If not already clicked sets background green and runStatus to Before then darkens second option if needed
      options0[1].classList.add("has-background-success")
      runStatus = "BEFORE"
      if (options0[0].classList.contains("has-background-success"))
        options0[0].classList.remove("has-background-success")
    }
  }
}

function onOption1Click() {
  if (this === options1[0]) {
    // Check if first option is clicked if yes sets to either
    if (options1[0].classList.contains("has-background-success")) {
      options1[0].classList.remove("has-background-success")
      in24 = "either"
    }
    // If not sets background green and in24 to coding then darkens second option if needed
    else {
      options1[0].classList.add("has-background-success")
      in24 = "Yes"
      if (options1[1].classList.contains("has-background-success"))
        options1[1].classList.remove("has-background-success")
    }
  }
  else if (this === options1[1]) {
    // Check if second option is clicked if yes and is clicked sets to either
    if (options1[1].classList.contains("has-background-success")) {
      options1[1].classList.remove("has-background-success")
      in24 = "either"
    }
    else { // If not already clicked sets background green and in24 to Before then darkens second option if needed
      options1[1].classList.add("has-background-success")
      in24 = "No"
      if (options1[0].classList.contains("has-background-success"))
        options1[0].classList.remove("has-background-success")
    }
  }
}

function onOption2Click() {
  if (!this.classList.contains("has-background-success")) {
    this.classList.add("has-background-success");
    listOfSites.push(this.innerHTML.trim());
    //console.log(listOfSites);
  }
  else {
    this.classList.remove("has-background-success");
   // console.log(this.innerHTML)
    //console.log(listOfSites.indexOf(this.innerHTML.trim()))
    listOfSites.splice(listOfSites.indexOf(this.innerHTML.trim()), 1);
    //console.log(listOfSites);
  }
}

function checkStatus(hackathon) {
  //console.log(hackathon.status, runStatus)
  if (hackathon.status === runStatus || runStatus === "either")
    return false
  return true
}

function checkIn24(hackathon) {
  if (hackathon.in_24_hours === in24 || in24 === "either")
    return false
  return true
}

function checkSites(hackathon) {
  if (listOfSites.includes(hackathon.site) || listOfSites.length === 0)
    return false
  return true
}

function onSearchClick() {
  let searchList = [];
  hackathonsdata.forEach(element => searchList.push(element));

  for (let i = 0; i < searchList.length; i++) {
    if (checkStatus(searchList[i]) || checkIn24(searchList[i]) || checkSites(searchList[i])) {
      searchList.splice(i, 1);
      i--;
    }
  }
  displayHackathons(searchList);
}
function createListeners(){
 options0 = document.querySelectorAll(".option0");
  options1 = document.querySelectorAll(".option1");
  options2 = document.querySelectorAll(".option2");
  searchButton = document.querySelector("#searchButton");

  options0.forEach(option0 => {
    option0.addEventListener("click", onOption0Click);
  });
  
  options1.forEach(option1 => {
    option1.addEventListener("click", onOption1Click);
  });
    options2.forEach(option2 => {
    option2.addEventListener("click", onOption2Click);
  });

searchButton.addEventListener("click", onSearchClick);
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}