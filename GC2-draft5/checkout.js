const cart = JSON.parse(localStorage.getItem('kitchenWheelCart') || 'null');
const orderDetails = document.getElementById('orderDetails');
const mealSubtotalEl = document.getElementById('mealSubtotal');
const shippingAmountEl = document.getElementById('shippingAmount');
const discountAmountEl = document.getElementById('discountAmount');
const totalAmountEl = document.getElementById('totalAmount');
const promoInput = document.getElementById('promo');
const promoMessage = document.getElementById('promoMessage');
const applyPromoBtn = document.getElementById('applyPromoBtn');

let currentCart = cart;
let promoApplied = false;
const VALID_PROMO_CODE = 'NEWUSERDISCOUNT';

function formatAmount(value) {
    return Number(value || 0).toFixed(2);
}

function renderOrder() {
    if (!currentCart) {
        orderDetails.innerHTML = '<p>Your basket is empty. Please add an order first.</p>';
        mealSubtotalEl.textContent = '0.00';
        shippingAmountEl.textContent = '0.00';
        discountAmountEl.textContent = '0.00';
        totalAmountEl.textContent = '0.00';
        applyPromoBtn.disabled = true;
        return;
    }

    orderDetails.innerHTML = `
        <p><strong>Name:</strong> ${currentCart.fullName}</p>
        <p><strong>Contact:</strong> +63 ${currentCart.contactNumber}</p>
        <p><strong>Address:</strong> ${currentCart.streetAddress}, ${currentCart.city}</p>
        <p><strong>Program:</strong> ${currentCart.programLabel}</p>
        <p><strong>Calories:</strong> ${currentCart.calories} CAL</p>
        <p><strong>Inclusions:</strong> ${currentCart.inclusions.join(', ')}</p>
        <p><strong>Quantity:</strong> ${currentCart.pax} pax</p>
        <p><strong>Delivery Time:</strong> ${
             currentCart.deliveryTime === "morning"
            ? "Morning (6:00 AM – 10:00 AM)"
             : "Evening (5:00 PM – 9:00 PM)"
        }</p>    
        <p><strong>Duration:</strong> ${currentCart.startDate} to ${currentCart.endDate} (${currentCart.days} day/s)</p>
        <p><strong>Restrictions / Notes:</strong> ${currentCart.restrictions || 'None'}</p>
    `;

    mealSubtotalEl.textContent = formatAmount(currentCart.mealSubtotal);
    shippingAmountEl.textContent = formatAmount(currentCart.shippingFee);
    discountAmountEl.textContent = formatAmount(currentCart.discountAmount);
    totalAmountEl.textContent = formatAmount(currentCart.finalTotal);
}

function applyPromo() {
    if (!currentCart) return;

    const enteredCode = promoInput.value.trim().toUpperCase();

    if (promoApplied || currentCart.promoCode) {
        promoMessage.textContent = 'Promo code has already been applied to this order.';
        promoMessage.className = 'status-message promo-error';
        return;
    }

    if (enteredCode !== VALID_PROMO_CODE) {
        promoMessage.textContent = 'Invalid promo code.';
        promoMessage.className = 'status-message promo-error';
        return;
    }

    const discount = currentCart.mealSubtotal * 0.10;
    currentCart.discountAmount = discount;
    currentCart.finalTotal = currentCart.mealSubtotal + currentCart.shippingFee - discount;
    currentCart.promoCode = VALID_PROMO_CODE;
    promoApplied = true;

    localStorage.setItem('kitchenWheelCart', JSON.stringify(currentCart));
    promoMessage.textContent = 'Promo applied successfully.';
    renderOrder();
}

function proceedToPayment() {
    if (!currentCart) return;

    const paymentMode = document.querySelector('input[name="payment"]:checked');
    if (!paymentMode) {
        alert('Please select a payment mode before proceeding.');
        return;
    }

    alert('End of MVP / Phase 1. Actual payment integration will be added in Phase 2.');
}

applyPromoBtn.addEventListener('click', applyPromo);
confirmOrderBtn.addEventListener('click', proceedToPayment);
renderOrder();