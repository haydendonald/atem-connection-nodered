
module.exports = function (RED) {
    //Main node definition
    function ATEMConnection(config) {
        RED.nodes.createNode(this, config);
        const { Atem } = require("atem-connection");
        var node = this;
        const atem = new Atem({ debugBuffers: config.debug == "yes" });
        const functions = {
            programInput: require("./functions/programInput.js")
        };

        //Register the available callbacks for the flow nodes
        var errorCallbacks = [];
        this.addErrorCallback = function (func) { // func(error)
            errorCallbacks.push(func);
        }
        var infoCallbacks = [];
        this.addInfoCallback = function (func) { // func(info)
            infoCallbacks.push(func);
        }
        var debugCallbacks = [];
        this.addDebugCallback = function (func) { // func(debug)
            debugCallbacks.push(func);
        }
        var connectionCallbacks = [];
        this.addConnectionCallback = function (func) { // func(state)
            connectionCallbacks.push(func);
        }
        var stateChangeCallbacks = [];
        this.addStateChangeCallback = function (func) { // func(state, pathToChange)
            stateChangeCallbacks.push(func);
        }
        var commandCallbacks = [];
        this.addCommandCallback = function (func) { // func(command)
            commandCallbacks.push(func);
        }
        var functionCallbacks = [];
        this.addfunctionCallback = function (func) { // func(func, data)
            functionCallbacks.push(func);
        }

        //Send a command to a function
        /**
         * Send a command to a function
         * @param {*} func The function name
         * @param {*} data The data object to send to the function
         * @param {*} callback The callback function for completion func(success, data)
         */
        this.send = function (func, data, callback) {
            var f = functions[func];
            if (f) {
                f.handleFlow(data, callback);
            }
            else {
                errorCallbacks.forEach((func) => func(`The function ${func} was not found`));
            }
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
            stateChangeCallbacks.forEach((func) => func(state, pathToChange));
            for(var funcName in functions) {
                if(functions[funcName].handleStateChange != undefined) {
                    var result = functions[funcName].handleStateChange(state, pathToChange);
                    if(result != undefined) {
                        functionCallbacks.forEach((func) => func(funcName, result));
                    }
                }
            }
        });
        atem.on("receivedCommand", (command) => {
            commandCallbacks.forEach((func) => func(command));
        });

        atem.connect(config.ipAddress);

        //On redeploy
        node.on("close", function () {
            atem.disconnect();
        });
    }

    //Add the node
    RED.nodes.registerType("atem-connection", ATEMConnection);
}
