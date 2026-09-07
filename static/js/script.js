let currentStep = 1;

const progressFill = document.getElementById("progress-fill");
const stepText = document.querySelector(".step");
const steps = document.querySelectorAll(".step-page");

function updateProgress() {

    stepText.innerText = "Step " + currentStep + " of 5";

    progressFill.style.width = (currentStep * 20) + "%";

}

function showStep(stepNumber) {

    steps.forEach(function(step) {
        step.style.display = "none";
    });

    steps[stepNumber - 1].style.display = "block";

    currentStep = stepNumber;

    updateProgress();

}
function updateStep3(){

    console.log("updateStep3() called");
    console.log("Transport =", transportInput.value);

    carOptions.style.display = "none";
    bikeOptions.style.display = "none";
    publicOptions.style.display = "none";

    if(transportInput.value === "Car"){

        console.log("Showing Car");

        step3Title.innerText = "Select Fuel Type";
        carOptions.style.display = "block";

    }

    else if(transportInput.value === "Bike"){

        console.log("Showing Bike");

        step3Title.innerText = "Select Fuel Type";
        bikeOptions.style.display = "block";

    }

    else if(transportInput.value === "Public Transport"){

        console.log("Showing Public Transport");

        step3Title.innerText = "Choose Public Transport";
        publicOptions.style.display = "block";

    }

}
const carOptions = document.getElementById("car-options");
const bikeOptions = document.getElementById("bike-options");
const publicOptions = document.getElementById("public-options");
const step3Title = document.getElementById("step3-title");
const welcomeScreen = document.getElementById("welcome-screen");
const dashboard = document.getElementById("dashboard");

welcomeScreen.addEventListener("click", function () {

    welcomeScreen.style.display = "none";
    dashboard.style.display = "block";

});

const next1 = document.getElementById("next1");
const back1 = document.getElementById("back1");

next1.addEventListener("click", function () {

    const start = document.getElementById("start").value.trim();
    const destination = document.getElementById("destination").value.trim();

    if (start === "" || destination === "") {
        alert("Please enter both Start Location and Destination.");
        return;
    }

    showStep(2);

});

back1.addEventListener("click", function () {
    showStep(1);
});

const next2 = document.getElementById("next2");
const back2 = document.getElementById("back2");

next2.addEventListener("click", function () {

    if (transportInput.value === "") {

        alert("Please select a transport mode.");

        return;

    }

    updateStep3();
    showStep(3);

});

back2.addEventListener("click", function () {
    showStep(2);
});

const transportCards = document.querySelectorAll(".transport-card");
const transportInput = document.getElementById("transport");


transportCards.forEach(function(card){

    card.addEventListener("click", function(){

        // Remove selection from all cards
        transportCards.forEach(function(c){
            c.classList.remove("selected");
        });

        // Highlight selected card
        card.classList.add("selected");

        // Save selected transport
        transportInput.value = card.dataset.value;

        console.log("Selected:", transportInput.value);

    });

});

const next3 = document.getElementById("next3");
const back3 = document.getElementById("back3");

next3.addEventListener("click", function () {

    if (transportInput.value === "Car") {

        if (document.getElementById("fuel").value === "") {
            alert("Please select a car model.");
            return;
        }

    }

    else if (transportInput.value === "Bike") {

        if (document.getElementById("fuel").value === "") {
            alert("Please select a bike model.");
            return;
        }

    }

    else {

        if (document.getElementById("public-transport").value === "") {
            alert("Please select a transport type.");
            return;
        }

    }

    showStep(4);

});

back3.addEventListener("click", function () {

    showStep(3);

});

const next4 = document.getElementById("next4");
const back4 = document.getElementById("back4");

next4.addEventListener("click", function () {

    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (date === "" || time === "") {
        alert("Please select both travel date and departure time.");
        return;
    }

    showStep(5);

});

back4.addEventListener("click", function () {

    showStep(4);

});

const carBrand = document.getElementById("car-brand");
const carModel = document.getElementById("car-model");

if (carBrand && carModel) {

    Object.keys(vehicles.Car).forEach(function(brand) {

        const option = document.createElement("option");

        option.value = brand;
        option.textContent = brand;

        carBrand.appendChild(option);
    
    });

    carBrand.addEventListener("change", function() {

        carModel.innerHTML = '<option calue="">Select Model</option>';

        const selectedBrand = this.value;

        if (!selectedBrand) return;

        Object.keys(vehicles.Car[selectedBrand]). forEach(function(model) {

            const option = document.createElement("option");

            option.value = model;
            option.textContent = model;

            carModel.appendChild(option);
        });
    });
        carModel.addEventListener("change", function () {

           const selectedBrand = carBrand.value;
            const selectedModel = this.value;

            if (!selectedModel) return;

            const vehicle = vehicles.Car[selectedBrand][selectedModel];

            document.getElementById("fuel").value = vehicle.fuel;
            document.getElementById("mileage").value = vehicle.mileage;
            document.getElementById("tank").value = vehicle.tank;

            console.log(vehicle);

        });
}

const bikeBrand = document.getElementById("bike-brand");
const bikeModel = document.getElementById("bike-model");

if (bikeBrand && bikeModel) {

    Object.keys(vehicles.Bike).forEach(function(brand) {

        const option = document.createElement("option");

        option.value = brand;
        option.textContent = brand;

        bikeBrand.appendChild(option);

    });

    bikeBrand.addEventListener("change", function() {

        bikeModel.innerHTML = '<option value="">Select Model</option>';

        const selectedBrand = this.value;

        if (!selectedBrand) return;

        Object.keys(vehicles.Bike[selectedBrand]).forEach(function(model) {

            const option = document.createElement("option");

            option.value = model;
            option.textContent = model;

            bikeModel.appendChild(option);

        });

    });

    bikeModel.addEventListener("change", function() {

        const selectedBrand = bikeBrand.value;
        const selectedModel = this.value;

        if (!selectedModel) return;

        const bike = vehicles.Bike[selectedBrand][selectedModel];

        document.getElementById("fuel").value = bike.fuel;
        document.getElementById("mileage").value = bike.mileage;
        document.getElementById("tank").value = bike.tank;

        console.log(bike);

    });

}

// Interface polish: keep the selected transport visually obvious.
document.querySelectorAll(".transport-card").forEach(function(card){
    card.addEventListener("click", function(){
        document.querySelectorAll(".transport-card").forEach(function(item){ item.classList.remove("selected"); });
        card.classList.add("selected");
    });
});
