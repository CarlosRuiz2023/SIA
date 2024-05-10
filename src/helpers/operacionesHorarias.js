function restarHoras(hora1, hora2) {
  var partsHora1 = hora1.split(":");
  var partsHora2 = hora2.split(":");

  var h1 = parseInt(partsHora1[0]);
  var m1 = parseInt(partsHora1[1]);
  var s1 = parseInt(partsHora1[2]);

  var h2 = parseInt(partsHora2[0]);
  var m2 = parseInt(partsHora2[1]);
  var s2 = parseInt(partsHora2[2]);

  if (h2 > 0) {
    var h = h1 - h2;
  } else {
    var h = h1;
  }
  if (m2 > 0) {
    var m = m1 - m2;
  } else {
    var m = m1;
  }
  if (s2 > 0) {
    var s = s1 - s2;
  } else {
    var s = s1;
  }

  if (s < 0) {
    s += 60;
    m--;
  }
  if (m < 0) {
    m += 60;
    h--;
  }

  return (
    (h < 10 ? "0" + h : h) +
    ":" +
    (m < 10 ? "0" + m : m) +
    ":" +
    (s < 10 ? "0" + s : s)
  );
}

function sumarHoras(hora1, hora2) {
  var partsHora1 = hora1.split(":");
  var partsHora2 = hora2.split(":");

  var h1 = parseInt(partsHora1[0]);
  var m1 = parseInt(partsHora1[1]);
  var s1 = parseInt(partsHora1[2]);

  var h2 = parseInt(partsHora2[0]);
  var m2 = parseInt(partsHora2[1]);
  var s2 = parseInt(partsHora2[2]);

  if (h2 > 0) {
    var h = h1 + h2;
  } else {
    var h = h1;
  }
  if (m2 > 0) {
    var m = m1 + m2;
  } else {
    var m = m1;
  }
  if (s2 > 0) {
    var s = s1 + s2;
  } else {
    var s = s1;
  }

  if (s >= 60) {
    s -= 60;
    m++;
  }

  if (m >= 60) {
    m -= 60;
    h++;
  }

  return (
    (h < 10 ? "0" + h : h) +
    ":" +
    (m < 10 ? "0" + m : m) +
    ":" +
    (s < 10 ? "0" + s : s)
  );
}

module.exports = {
  restarHoras,
  sumarHoras,
};
