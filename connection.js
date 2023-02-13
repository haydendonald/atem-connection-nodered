
module.exports = function (RED) {
    //Main node definition
    function ATEMConnection(config) {
        RED.nodes.createNode(this, config);
        const { Atem } = require("atem-connection");
        var node = this;
        const atem = new Atem({ debugBuffers: config.debug == "yes" });
        const functions = {
            mixEffects: require("./functions/mixEffects.js")()
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
        this.addFunctionCallback = function (func) { // func(func, data)
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
            //Go through the mix effects and replace the inputs with their objects
            for (var i in state.video.mixEffects) {
                state.video.mixEffects[i].programInput = state.inputs[state.video.mixEffects[i].programInput] || state.video.mixEffects[i].programInput;
                state.video.mixEffects[i].previewInput = state.inputs[state.video.mixEffects[i].previewInput] || state.video.mixEffects[i].previewInput;

                //Keyers
                for (var j in state.video.mixEffects[i].upstreamKeyers) {
                    state.video.mixEffects[i].upstreamKeyers[j].cutSource = state.inputs[state.video.mixEffects[i].upstreamKeyers[j].cutSource] || state.video.mixEffects[i].upstreamKeyers[j].cutSource;
                    state.video.mixEffects[i].upstreamKeyers[j].fillSource = state.inputs[state.video.mixEffects[i].upstreamKeyers[j].fillSource] || state.video.mixEffects[i].upstreamKeyers[j].fillSource;
                }
            }

            //Go through the dsKeyers and replace the inputs with their objects
            for (var i in state.video.downstreamKeyers) {
                state.video.downstreamKeyers[i].sources.fillSource = state.inputs[state.video.downstreamKeyers[i].sources.fillSource] || state.video.downstreamKeyers[i].sources.fillSource;
                state.video.downstreamKeyers[i].sources.cutSource = state.inputs[state.video.downstreamKeyers[i].sources.cutSource] || state.video.downstreamKeyers[i].sources.cutSource;
            }

            //Go through the aux's and replace the inputs with their objects
            for (var i in state.video.auxilliaries) {
                state.video.auxilliaries[i] = state.inputs[state.video.auxilliaries[i]] || state.video.auxilliaries[i];
            }

            //Go through the super sources and replace the inputs with their objects
            for (var i in state.video.superSources) {
                state.video.superSources[i].properties.artFillSource = state.inputs[state.video.superSources[i].properties.artFillSource] || state.video.superSources[i].properties.artFillSource;
                state.video.superSources[i].properties.artCutSource = state.inputs[state.video.superSources[i].properties.artCutSource] || state.video.superSources[i].properties.artCutSource;

                //Boxes
                for (var j in state.video.superSources[i].boxes) {
                    state.video.superSources[i].boxes[j].source = state.inputs[state.video.superSources[i].boxes[j].source] || state.video.superSources[i].boxes[j].source;
                }
            }

            //Go through the multiViewers and replace the inputs with their objects
            for (var i in state.settings.multiViewers) {
                for (var j in state.settings.multiViewers[i].windows) {
                    state.settings.multiViewers[i].windows[j].source = state.inputs[state.settings.multiViewers[i].windows[j].source] || state.settings.multiViewers[i].windows[j].source;
                }
            }

            stateChangeCallbacks.forEach((func) => func(state, pathToChange));

            //Convert a string pathToChange to array if needed
            if (!Array.isArray(pathToChange)) {
                pathToChange = [pathToChange];
            }

            //Send to the functions to see if they can handle the request
            for (var funcName in functions) {
                for (i in pathToChange) {
                    var result = functions[funcName].handleStateChange(state, pathToChange[i]);
                    if (result != undefined) {
                        functionCallbacks.forEach((func) => func(result.func, result.data, state, pathToChange[i]));
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
    RED.nodes.registerType("atem-connection-connection", ATEMConnection);
}
