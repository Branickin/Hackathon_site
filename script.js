let siteHolder = document.querySelector("#siteHolder")
let cardHolder = document.querySelector("#cardHolder");
let errorHolder = document.querySelector("#errorHolder")
let hackathonAmount = document.querySelector("#hackathonAmount");
console.log(hackathonAmount)
let hackathonsdata;
let siteData;
let runStatus = "either";
let in24 = "either"
let listOfSites = [];

async function main(){
  hackathonsdata = await fetchHackathons();
  siteData = await getSites()
  siteCount = siteData.length;
  displayAmount(siteCount);
  displaySites(siteData)
  displayHackathons(hackathonsdata);
  setInterval(decrementDuration, 1000);
  createListeners();
}

main();