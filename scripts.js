const myEndpoint = "https://free.currconv.com/api/v7/";
// const API_KEY = "c40de37da267595c9235";

require("dotenv").config();
const API_KEY = process.env.API_KEY;

console.log("Starting...");

const dropdownOne = document.querySelector("#curr1");
const dropdownTwo = document.querySelector("#curr2");
const resultsEl = document.querySelector(".resultText");
const convertInput = document.querySelector('input[name="amount"]');
const convertBtn = document.querySelector('button[name="convert"]');

// Get list of currencies for the input dropdown
async function getCurrencies(endpoint) {
  const query = `apiKey=${API_KEY}`;
  const response = await fetch(`${myEndpoint}currencies?${query}`);

  let data = await response.json();
  data = data.results;
  console.log(data);

  let currencyIDs = Object.values(data)
    .map(function(x) {
      if (x["id"] != "ALL") {
        if (x["currencyName"]) {
          return `${x["id"]} - ${x["currencyName"]}`;
        }
      } else {
        return "";
      }
    })
    .sort();
  currencyIDs = currencyIDs.map(x => `<option>${x}</option>`).join("");

  // Populate dropdowns
  dropdownOne.innerHTML = currencyIDs;
  dropdownTwo.innerHTML = currencyIDs;
}

async function convert() {
  console.log(`Converting function...`);
  resultsEl.textContent = "Loading...";

  // Get values of input
  const value1 = dropdownOne.value.split("-")[0].trim();
  const value2 = dropdownTwo.value.split("-")[0].trim();
  const conversionAmount = convertInput.value;

  console.log(`Need to convert ${conversionAmount} ${value1} to ${value2}`);

  // Get converted money symbol
  const symbResponse = await fetch(`${myEndpoint}currencies?apiKey=${API_KEY}`);
  let symbData = await symbResponse.json();
  symbData = symbData.results;
  console.log(symbData);
  const currSymbol = symbData[`${value2}`]["currencySymbol"];
  const currName = symbData[`${value2}`]["currencyName"];

  // Run conversion with endpoint
  const query = `apiKey=${API_KEY}&q=${value1}_${value2}`;

  // Get data
  const response = await fetch(`${myEndpoint}convert?${query}`);
  let data = await response.json();
  data = data.results;
  console.log(data);

  // Determine Amounts
  const conversionFactor = data[`${value1}_${value2}`]["val"];
  let convertedAmt = (conversionFactor * parseFloat(conversionAmount)).toFixed(
    2
  );
  isNaN(convertedAmt)
    ? (convertedAmt = "Please provide an amount to convert!")
    : convertedAmt;

  // Write Results
  if (currSymbol && !isNaN(convertedAmt)) {
    resultsEl.textContent = `${currSymbol}${convertedAmt} ${currName}s`;
  } else {
    if (!isNaN(convertedAmt))
      resultsEl.textContent = `${convertedAmt} ${currName}s`;
    else {
      resultsEl.textContent = `${convertedAmt}`;
    }
  }
}

// Populate drop-downs
getCurrencies(myEndpoint);
convertBtn.addEventListener("click", convert);

console.log("\nFinished.");
