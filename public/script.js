import Client from "./js/Client.js";
import VerizonDisplay from "./js/VerizonDisplay.js";

let ip = '54.205.23.184';
let port = 3000;


//public user interface
const client = new Client(
  new WebSocket("ws://" + ip + ":" + port),
  new VerizonDisplay(document),
  false,
  false
);

document.addEventListener('click', function (e) {

  if (e.target.id === 'activateCommand') {
    client.activateCommand();
    return;
  }

  if (e.target.id === 'testCommand') {
    client.checkActiveForTestAndRun();
    return;
  }

  if (e.target.id === 'refresh') {
    window.location.reload();
    return;
  }


  let x = e.target.id.charAt(0);
  let y = e.target.id.charAt(1);
  client.sendPosition(x, y);

}, false);

