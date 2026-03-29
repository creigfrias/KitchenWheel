// ✅ CALORIES DROPDOWN
function updateCalories() {
    const program = document.getElementById("program").value;
    const calories = document.getElementById("calories");

    calories.innerHTML = '<option value="">-- Select Calories --</option>';

    let options = [];

    if (
        program === "low_calorie" ||
        program === "high_protein" ||
        program === "keto" ||
        program === "low_salt_fat"
    ) {
        options = ["1200 Cal", "1500 Cal", "1800 Cal", "2000 Cal"];
    } 
    else if (program === "endurance" || program === "strength") {
        options = ["2500 Cal", "3000 Cal"];
    }

    options.forEach(cal => {
        let option = document.createElement("option");
        option.value = cal;
        option.text = cal;
        calories.appendChild(option);
    });
}


// ✅ DATE VALIDATION
const today = new Date().toISOString().split("T")[0];

const start = document.getElementById("start");
const end = document.getElementById("end");

if (start && end) {
    start.min = today;
    end.min = today;

    start.addEventListener("change", function () {
        end.min = this.value;
    });
}


// ✅ REQUIRE AT LEAST ONE INCLUSION
document.querySelector("form").addEventListener("submit", function(e) {
    const checked = document.querySelectorAll('input[name="inclusions[]"]:checked');

    if (checked.length === 0) {
        alert("Please select at least one inclusion.");
        e.preventDefault();
    }
});


// ✅ CONFIRMATION MESSAGE
function confirmAddToCart() {
    alert("✅ Added to cart!");
    return true; // allows reload
}

// PRICE TABLE
const prices = {
    low_calorie: {1200:250,1500:350,1800:415,2000:465},
    high_protein: {1200:465,1500:540,1800:600,2000:675},
    keto: {1200:465,1500:540,1800:600,2000:675},
    low_salt_fat: {1200:465,1500:540,1800:600,2000:675},
    endurance: {2500:850,3000:1000},
    strength: {2500:950,3000:1150}
};

// UPDATE CALORIES DROPDOWN
function updateCalories() {
    const program = document.getElementById("program").value;
    const calories = document.getElementById("calories");

    calories.innerHTML = '<option value="">-- Select Calories --</option>';

    if (!program) return;

    Object.keys(prices[program]).forEach(cal => {
        let option = document.createElement("option");
        option.value = cal;
        option.textContent = cal + " CAL";
        calories.appendChild(option);
    });
}

// HANDLE FORM SUBMIT
document.querySelector("form").addEventListener("submit", function(e) {
    e.preventDefault();

    const program = document.getElementById("program").value;
    const calories = document.getElementById("calories").value;
    const pax = document.getElementById("pax").value;

    const start = new Date(document.getElementById("start").value);
    const end = new Date(document.getElementById("end").value);

    // compute days
    const days = (end - start) / (1000 * 60 * 60 * 24) + 1;

    const pricePerDay = prices[program][calories];
    const total = pricePerDay * pax * days;

    // save to localStorage
    localStorage.setItem("total", total);

    // redirect
    window.location.href = "checkout.html";
});