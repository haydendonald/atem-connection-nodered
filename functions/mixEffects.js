/**
 * The mix effects handler
 * By Hayden Donald 2023
 */

module.exports = function () {
    return {
        /**
         * Handle the incoming message from the flow
         * @param {*} atem The atem object
         * @param {*} func The function
         * @param {*} payload The payload object
         * @param {*} callback The callback for the completion func(success, data)
         */
        handleFlow(atem, func, payload, callback) {
            switch (func) {
                //Set the preview/program input
                case "changePreviewInput":
                case "changeProgramInput": {
                    //Validate
                    if (payload.ME === undefined) {
                        callback(false, "The ME parameter was missing");
                        return true;
                    }
                    if (!Number.isInteger(payload.ME) || payload.ME < 0) {
                        callback(false, "The ME parameter must be an integer starting from 0");
                        return true;
                    }
                    if (payload.inputId) {
                        if (!Number.isInteger(payload.inputId) || payload.inputId < 0) {
                            callback(false, "The ME parameter must be an integer starting from 0");
                            return true;
                        }
                    }

                    //Find the input id
                    var inputId;
                    if (payload.inputId !== undefined) { inputId = payload.inputId; }
                    else if (payload.inputLongName !== undefined) {
                        for (var i in atem.state.inputs) {
                            if (atem.state.inputs[i].longName == payload.inputLongName) { inputId = parseInt(i); break; }
                        }
                    }
                    else if (payload.inputShortName !== undefined) {
                        for (var i in atem.state.inputs) {
                            if (atem.state.inputs[i].shortName == payload.inputShortName) { inputId = parseInt(i); break; }
                        }
                    }
                    else {
                        callback(false, "The input was missing, inputId, inputLongName, or inputShortName is required");
                        return true;
                    }
                    if (inputId === undefined) {
                        callback(false, "The input was not found");
                        return true;
                    }

                    //Execute
                    if (func == "changePreviewInput") {
                        atem.changePreviewInput(inputId, payload.ME).then(() => {
                            callback(true, atem.state);
                        }).catch(() => {
                            callback(false);
                        });
                    }
                    else {
                        atem.changeProgramInput(inputId, payload.ME).then(() => {
                            callback(true, atem.state);
                        }).catch(() => {
                            callback(false);
                        });
                    }

                    return true;
                }
                //Get a mix effect block's current state
                case "getMixEffectBlock": {
                    //Validate
                    if (payload.ME === undefined) {
                        callback(false, "The ME parameter was missing");
                        return true;
                    }
                    if (!Number.isInteger(payload.ME) || payload.ME < 0) {
                        callback(false, "The ME parameter must be an integer starting from 0");
                        return true;
                    }

                    callback(true, {
                        func: "getMixEffectBlock",
                        data: atem.state.video.mixEffects[payload.ME]
                    });

                    return true;
                }
            }
        },

        //Handle an incoming state change
        handleStateChange(state, pathToChange) {
            if (pathToChange.includes("video.mixEffects")) {
                if (pathToChange.includes(".programInput")) {
                    return {
                        func: "programInput",
                        data: {
                            ME: state.video.mixEffects[pathToChange.split('.')[2]],
                            input: state.video.mixEffects[pathToChange.split('.')[2]].programInput
                        }
                    }
                }
                if (pathToChange.includes(".previewInput")) {
                    return {
                        func: "previewInput",
                        data: {
                            ME: state.video.mixEffects[pathToChange.split('.')[2]],
                            input: state.video.mixEffects[pathToChange.split('.')[2]].previewInput
                        }
                    }
                }
            }
        },

        //When node red closes
        close() { },
    }
}