let total = localStorage.getItem("total");
document.getElementById("totalAmount").textContent = total;

// PROMO LOGIC
function applyPromo() {
    const code = document.getElementById("promo").value;

    if (code === "SAVE10") {
        total = total * 0.9;
    } else if (code === "SAVE20") {
        total = total * 0.8;
    } else {
        alert("Invalid Promo Code");
        return;
    }

    document.getElementById("totalAmount").textContent = total.toFixed(2);
}

// CONFIRM ORDER
function confirmOrder() {
    alert("Order Confirmed!");
    localStorage.clear();
    window.location.href = "index.htm";
}