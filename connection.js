
module.exports = function(RED)
{
    //Main node definition
    function ATEMConnection(config)
    {
        RED.nodes.createNode(this, config);
        const { Atem } = require("atem-connection");
        var node = this;
        const atem = new Atem({debugBuffers: config.debug == "yes"});

        //Register the available callbacks for the flow nodes
        var errorCallbacks = [];
        this.addErrorCallback = function(func) { // func(error)
            errorCallbacks.push(func);
        }
        var infoCallbacks = [];
        this.addInfoCallback = function(func) { // func(info)
            infoCallbacks.push(func);
        }
        var debugCallbacks = [];
        this.addDebugCallback = function(func) { // func(debug)
            debugCallbacks.push(func);
        }
        var connectionCallbacks = [];
        this.addConnectionCallback = function(func) { // func(state)
            connectionCallbacks.push(func);
        }
        var stateChangeCallbacks = [];
        this.addStateChangeCallback = function(func) { // func(state, pathToChange)
            stateChangeCallbacks.push(func);
        }
        var commandCallbacks = [];
        this.addCommandCallback = function(func) { // func(command)
            commandCallbacks.push(func);
        }

        //Register the atem events
        atem.on("error", (error) => {
            node.error(error);
            errorCallbacks.forEach((func) => func(error));
        });
        atem.on("info", (info) => {
            infoCallbacks.forEach((func) => func(info));
        });
        atem.on("debug", (debug) => {
            debugCallbacks.forEach((func) => func(debug));
        });
        atem.on("connected", () => {
            node.log("Successfully connected to the ATEM");
            connectionCallbacks.forEach((func) => func("connected"));
        });
        atem.on("disconnected", () => {
            node.error("Disconnected from the ATEM");
            connectionCallbacks.forEach((func) => func("disconnected"));
        });
        atem.on("stateChanged", (state, pathToChange) => {
            stateChangeCallbacks.forEach((func) => func(state, pathToChange));;
        });
        atem.on("receivedCommand", (command) => {
            commandCallbacks.forEach((func) => func(command));
        });

        atem.connect(config.ipAddress);

        //On redeploy
        node.on("close", function() {
            atem.disconnect();
        });
    }

    //Add the node
    RED.nodes.registerType("atem-connection", ATEMConnection);
}
