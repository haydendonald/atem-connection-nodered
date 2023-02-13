module.exports = function (RED) {
  //Main Function
  function ATEM(config) {
    RED.nodes.createNode(this, config);
    var connection = RED.nodes.getNode(config.connection);
    var node = this;


    //Error / Info events
    connection.addErrorCallback((error) => {
      node.send({
        topic: "error",
        payload: error
      });
    });
    connection.addInfoCallback((info) => {
      node.send({
        topic: "info",
        payload: info
      });
    });
    connection.addDebugCallback((info) => {
      node.send({
        topic: "debug",
        payload: info
      });
    });


    //State change events
    connection.addStateChangeCallback((state, pathToChange) => {
      node.send({
        topic: "stateChange",
        payload: {
          state,
          pathToChange
        }
      });
    });

    //Command events
    connection.addCommandCallback((command) => {
      node.send({
        topic: "command",
        payload: command
      });
    });

    //Function events
    connection.addFunctionCallback((func, data, state) => {
      node.send({
        topic: "function",
        payload: {
          function: func,
          data,
          state,
          pathToChange: data.pathToChange
        }
      });
    });

    //Connection events
    connection.addConnectionCallback((state) => {
      switch (state) {
        case "connected": {
          node.status({ fill: "green", shape: "dot", text: "Connected" });
          break;
        }
        case "disconnected": {
          node.status({ fill: "red", shape: "dot", text: "Disconnected" });
          break;
        }
      }
      node.send({
        topic: "connection",
        payload: state
      });
    });


    node.status({ fill: "orange", shape: "dot", text: "Connecting..." });
    node.on("close", function () { });
    node.on("input", function (msg) { });
  }

  RED.nodes.registerType("atem-connection-atem", ATEM);
}
