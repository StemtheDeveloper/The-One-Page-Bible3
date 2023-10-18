// Get the current date  
let currentDate = new Date();

// Set your son's birthdate
let birthdate = new Date("2022-04-22"); // Replace YYYY-MM-DD with your son's actual birthdate

// Calculate the age in months
let ageInMonths = (currentDate.getFullYear() - birthdate.getFullYear()) * 12;
ageInMonths -= birthdate.getMonth() + 1;
ageInMonths += currentDate.getMonth() + 1;

// Update the <p> element with your son's age
document.getElementById("danielsAge").textContent = " my " + ageInMonths + " month old son Daniel.";

// Function to update the age every year
function updateAge() {
  // Increment the age in months by 12
  ageInMonths += 12;
  
  // Update the <p> element with the updated age
  document.getElementById("danielsAge").textContent = " my " + ageInMonths + " month old son Daniel.";
}

// Call the updateAge function every year
setInterval(updateAge, 365 * 24 * 60 * 60 * 1000); // 365 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds