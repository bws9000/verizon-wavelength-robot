import Client from "./js/Client.js";
import VerizonDisplay from "./js/VerizonDisplay.js";

//let ip = '54.205.23.184';
//let port = 3001;
let ip = 'localhost';
let port = 9898;


//public user interface
const client = new Client(
  new WebSocket("ws://" + ip + ":" + port),
  new VerizonDisplay(document),
  false,
  false
);

document.addEventListener('click', function (e) {
  let x = e.target.id.charAt(0);
  let y = e.target.id.charAt(1);
  client.sendPosition(x, y);

  if (e.target.id === 'activateCommand') {
    client.activateCommand();
  }
}, false);

