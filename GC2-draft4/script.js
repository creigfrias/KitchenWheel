const prices = {
    low_calorie: { 1200: 280, 1500: 350, 1800: 415, 2000: 465 },
    high_protein: { 1200: 465, 1500: 540, 1800: 600, 2000: 675 },
    keto: { 1200: 465, 1500: 540, 1800: 600, 2000: 675 },
    low_salt_fat: { 1200: 465, 1500: 540, 1800: 600, 2000: 675 },
    endurance: { 2500: 850, 3000: 1000 },
    strength: { 2500: 950, 3000: 1150 }
};

const shippingFees = {
    Katipunan: 50,
    'España': 70,
    Taft: 80,
    Mendiola: 70,
    Sampaloc: 65
};

const programLabels = {
    low_calorie: 'Low Calorie',
    high_protein: 'High Protein',
    keto: 'Keto',
    low_salt_fat: 'Low Salt, Low Fat',
    endurance: 'Endurance',
    strength: 'Strength'
};

const orderForm = document.getElementById('orderForm');

if (orderForm) {
    const programSelect = document.getElementById('program');
    const caloriesSelect = document.getElementById('calories');
    const startInput = document.getElementById('start');
    const endInput = document.getElementById('end');
    const citySelect = document.getElementById('city');
    const paxInput = document.getElementById('pax');
    const contactInput = document.getElementById('contactnumber');

    const today = new Date().toISOString().split('T')[0];
    startInput.min = today;
    endInput.min = today;

    function updateCalories() {
        const program = programSelect.value;
        caloriesSelect.innerHTML = '<option value="">-- Select Calories --</option>';

        if (!program) return;

        Object.keys(prices[program]).forEach((cal) => {
            const option = document.createElement('option');
            option.value = cal;
            option.textContent = `${cal} CAL`;
            caloriesSelect.appendChild(option);
        });

        updateEstimatedSummary();
    }

    function sanitizePhoneNumber() {
        contactInput.value = contactInput.value.replace(/\D/g, '').slice(0, 10);
    }

    function computeDays(startValue, endValue) {
        if (!startValue || !endValue) return 0;
        const startDate = new Date(startValue);
        const endDate = new Date(endValue);
        const diff = endDate - startDate;
        if (diff < 0) return 0;
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    }

    function updateEstimatedSummary() {
        const program = programSelect.value;
        const calories = caloriesSelect.value;
        const pax = Number(paxInput.value) || 0;
        const city = citySelect.value;
        const days = computeDays(startInput.value, endInput.value);

        const pricePerDay = program && calories ? prices[program][calories] : 0;
        const mealSubtotal = pricePerDay * pax * days;
        const shippingFee = city ? (shippingFees[city] || 0) * days : 0;
        const total = mealSubtotal + shippingFee;

        document.getElementById('pricePerDay').textContent = pricePerDay.toFixed(2);
        document.getElementById('shippingFee').textContent = shippingFee.toFixed(2);
        document.getElementById('estimatedTotal').textContent = total.toFixed(2);
    }

    function validateForm() {
        const firstName = document.getElementById('firstname').value.trim();
        const lastName = document.getElementById('lastname').value.trim();
        const city = citySelect.value;
        const streetAddress = document.getElementById('streetAddress').value.trim();
        const program = programSelect.value;
        const calories = caloriesSelect.value;
        const checkedInclusions = document.querySelectorAll('input[name="inclusions"]:checked');
        const deliveryTime = document.querySelector('input[name="delivery_time"]:checked');
        const startValue = startInput.value;
        const endValue = endInput.value;
        const contactNumber = contactInput.value.trim();
        const pax = Number(paxInput.value);

        if (!firstName || !lastName || !city || !streetAddress || !program || !calories || !startValue || !endValue) {
            alert('Please complete all required details before adding to cart.');
            return false;
        }

        if (!/^9\d{9}$/.test(contactNumber)) {
            alert("Please input a valid contact number.");
            return false;
        }

        if (checkedInclusions.length === 0) {
            alert('Please select at least one inclusion.');
            return false;
        }

        if (!deliveryTime) {
            alert('Please select a delivery time.');
            return false;
        }

        if (pax < 1) {
            alert('Quantity must be at least 1 pax.');
            return false;
        }

        if (computeDays(startValue, endValue) === 0) {
            alert('End date must be the same as or later than the start date.');
            return false;
        }

        return true;
    }

    function saveCart() {
        const program = programSelect.value;
        const calories = Number(caloriesSelect.value);
        const city = citySelect.value;
        const days = computeDays(startInput.value, endInput.value);
        const pax = Number(paxInput.value);
        const pricePerDay = prices[program][calories];
        const mealSubtotal = pricePerDay * pax * days;
        const shippingFee = (shippingFees[city] || 0) * days;
        const finalTotal = mealSubtotal + shippingFee;

        const cart = {
            firstName: document.getElementById('firstname').value.trim(),
            lastName: document.getElementById('lastname').value.trim(),
            fullName: `${document.getElementById('firstname').value.trim()} ${document.getElementById('lastname').value.trim()}`,
            contactNumber: contactInput.value.trim(),
            city,
            streetAddress: document.getElementById('streetAddress').value.trim(),
            program,
            programLabel: programLabels[program],
            calories,
            inclusions: Array.from(document.querySelectorAll('input[name="inclusions"]:checked')).map((item) => item.value),
            pax,
            restrictions: document.getElementById('restrictions').value.trim(),
            deliveryTime: document.querySelector('input[name="delivery_time"]:checked').value,
            startDate: startInput.value,
            endDate: endInput.value,
            days,
            pricePerDay,
            mealSubtotal,
            shippingFee,
            discountAmount: 0,
            promoCode: '',
            finalTotal
        };

        localStorage.setItem('kitchenWheelCart', JSON.stringify(cart));
    }

    programSelect.addEventListener('change', updateCalories);
    [caloriesSelect, citySelect, paxInput, startInput, endInput].forEach((element) => {
        element.addEventListener('change', updateEstimatedSummary);
        element.addEventListener('input', updateEstimatedSummary);
    });

    startInput.addEventListener('change', function () {
        endInput.min = this.value;
        if (endInput.value && endInput.value < this.value) {
            endInput.value = this.value;
        }
        updateEstimatedSummary();
    });

    contactInput.addEventListener('input', sanitizePhoneNumber);

    orderForm.addEventListener('submit', function (event) {
        event.preventDefault();
        sanitizePhoneNumber();

        if (!validateForm()) return;

        saveCart();
        alert('Added to cart successfully.');
    });
}
