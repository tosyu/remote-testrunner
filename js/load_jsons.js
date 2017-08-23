var g_page_step = 10;
var g_db_keys = [];
var g_db_ref = "";

$(document).ready(function() {
  change_device("stm32");
});

function change_device(device) {
  $('#navbar li').removeClass('active');
  $('#show-' + device).addClass('active');
  $('#css-dynamic').attr('href', 'css/device_' + device + '.css');
  clear();
  set_info(device);
  fetch_keys(device);
}

function clear() {
  $(".pagination").empty();
  $("#testruns").empty();
  $("#loading").show();
}

function set_info(device) {
  switch (device) {
    case "stm32":
      $("#info-device")
        .attr('href', "http://www.st.com/en/evaluation-tools/stm32f4discovery.html")
        .text("STM32F4-Discovery");
      $("#info-platform")
        .attr('href', "http://nuttx.org/")
        .text("NuttX");
      $("#info-image").attr('src', "img/stm32f4_discovery.jpg");
      break;
    case "rpi2":
      $("#info-device")
        .attr('href', "https://www.raspberrypi.org/products/raspberry-pi-2-model-b/")
        .text("Raspberry Pi 2 Model B");
      $("#info-platform")
        .attr('href', "https://www.raspbian.org/")
        .text("Raspbian Jessie");
      $("#info-image").attr('src', "img/raspberrypi2.jpg");
      break;
    case "artik053":
      $("#info-device")
        .attr('href', "https://developer.artik.io/documentation/artik-05x/")
        .text("Artik 053");
      $("#info-platform")
        .attr('href', "https://github.com/Samsung/TizenRT")
        .text("TizenRT");
      $("#info-image").attr('src', "img/artik053.jpg");
      break;
  }
}

function fetch_keys(device) {
  var config = {
    apiKey: "AIzaSyARcofxNc54KtBbhHSCCGF7C4gEJ2HT4W8",
    authDomain: "iotjs-ee3fd.firebaseapp.com",
    databaseURL: "https://iotjs-ee3fd.firebaseio.com",
    projectId: "iotjs-ee3fd",
    storageBucket: "iotjs-ee3fd.appspot.com",
    messagingSenderId: "221110119208"
  };

  g_db_keys = []

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  g_db_ref = firebase.database().ref('iotjs/' + device);

  axios.get(g_db_ref.toString() + '.json?shallow=true')
    .then(function (res) {
      if (res.data) {
        g_db_keys = Object.keys(res.data).sort();
        var pageCount = g_db_keys.length / g_page_step;
        render_pagination(g_db_keys.length, g_page_step);
        g_db_keys.reverse();
        render_testruns(0, g_page_step);
      }
      fetch_chart_data(device);

    });
}
