function calculateSI() {
  document.getElementById("i").innerHTML = "";
  document.getElementById("amt").innerHTML = "";
  document.getElementById("info").innerHTML = "";

  let p = parseFloat(document.getElementById("p").value);
  let n = parseFloat(document.getElementById("n").value);

  if (isNaN(p) || isNaN(n)) {
    document.getElementById("info").innerHTML = "Enter a Valid Input.";
    return;
  }

  if (p < 500 || p > 10000) {
    document.getElementById("info").innerHTML = "Enter a Principal Amount in this Range $500-$10,000.";
    return;
  }

  let r = 0;
  if (p <= 1000) {
    r = 5;
  } else if (p > 1000 && p < 5000) {
    r = 7;
  } else {
    r = 10;
  }

  let bonus = false;

  if (n > 5) {
    r += 2;
    bonus = true;
  }

  let i = (p * n * r) / 100;
  let totalAmt = p + i;

  let result = "Bonus 2(%) Interest Applied : " + bonus +" <br> Applied Rate of Interest :" + r + "(%)";

  document.getElementById("i").innerHTML = i;
  document.getElementById("amt").innerHTML = totalAmt;
  document.getElementById("info").innerHTML = result;
}
