const logEvent = require("./logEvents");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

//initialize object
const myEmitter = new MyEmitter();

//add a listener to the log event
myEmitter.on("log", (msg) => logEvent(msg));

setTimeout(() => {
  //Emit event
  myEmitter.emit("log", "Log event emitted!!!");
}, 2000);
