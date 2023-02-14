module.exports = function () {
    return {
        /**
         * Validate if an ME is valid
         * @param {*} me 
         */
        validateME(me) {
            //Validate
            if (me === undefined) {
                return "The ME parameter was missing";
            }
            if (!Number.isInteger(me) || me < 0) {
                return "The ME parameter must be an integer starting from 0";
            }
            return true;
        },


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
                    var MEValidation = validateME(payload.ME);
                    if (MEValidation != true) {
                        callback(false, MEValidation);
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
                            callback(true, `Preview input changed on ME ${payload.ME} to input ${inputId}`);
                        }).catch((e) => {
                            callback(false, `Failed to set preview input on ME ${payload.ME} to input ${inputId}: ${e}`);
                        });
                    }
                    else {
                        atem.changeProgramInput(inputId, payload.ME).then(() => {
                            callback(true, `Program input changed on ME ${payload.ME} to input ${inputId}`);
                        }).catch((e) => {
                            callback(false, `Failed to set program input on ME ${payload.ME} to input ${inputId}: ${e}`);
                        });
                    }

                    return true;
                }
                case "autoTransition": {
                    var MEValidation = validateME(payload.ME);
                    if (MEValidation != true) {
                        callback(false, MEValidation);
                        return true;
                    }

                    atem.autoTransition(parseInt(payload.ME)).then(() => {
                        callback(true, `Auto transition performed on ME ${payload.ME}`);
                    }).catch((e) => {
                        callback(false, `Auto transition failed on ME ${payload.ME}: ${e}`);
                    });
                    return true;
                }
                case "cut": {
                    var MEValidation = validateME(payload.ME);
                    if (MEValidation != true) {
                        callback(false, MEValidation);
                        return true;
                    }

                    atem.cut(parseInt(payload.ME)).then(() => {
                        callback(true, `Cut transition performed on ME ${payload.ME}`);
                    }).catch((e) => {
                        callback(false, `Cut transition failed on ME ${payload.ME}: ${e}`);
                    });
                    return true;
                }
                case "fadeToBlack": {
                    var MEValidation = validateME(payload.ME);
                    if (MEValidation != true) {
                        callback(false, MEValidation);
                        return true;
                    }

                    atem.fadeToBlack(parseInt(payload.ME)).then(() => {
                        callback(true, `FTB transition performed on ME ${payload.ME}`);
                    }).catch((e) => {
                        callback(false, `FTB transition failed on ME ${payload.ME}: ${e}`);
                    });
                    return true;
                }
                case "setTransitionPosition": {
                    var MEValidation = validateME(payload.ME);
                    if (MEValidation != true) {
                        callback(false, MEValidation);
                        return true;
                    }

                    //Validate the position
                    if (payload.position === undefined) {
                        return "The position parameter was missing";
                    }
                    if (!Number.isInteger(payload.position) || payload.position < 0 || payload.position > 32767) {
                        return "The position parameter must be an integer starting from 0 and be less than 32768";
                    }


                    atem.setTransitionPosition(parseInt(payload.position), parseInt(payload.ME)).then(() => {
                        callback(true, `Set transition position performed on ME ${payload.ME}`);
                    }).catch((e) => {
                        callback(false, `Set transition position failed on ME ${payload.ME}: ${e}`);
                    });
                    return true;
                }
                //Get a mix effect block's current state
                case "getMixEffectBlock": {
                    var MEValidation = validateME(payload.ME);
                    if (MEValidation != true) {
                        callback(false, MEValidation);
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
                if (pathToChange.includes(".transitionPosition")) {
                    var data = state.video.mixEffects[pathToChange.split('.')[2]].transitionPosition;
                    data.ME = state.video.mixEffects[pathToChange.split('.')[2]];
                    return {
                        func: "transitionPosition",
                        data
                    }
                }
                if (pathToChange.includes(".fadeToBlack")) {
                    var data = state.video.mixEffects[pathToChange.split('.')[2]].fadeToBlack;
                    data.ME = state.video.mixEffects[pathToChange.split('.')[2]];
                    return {
                        func: "fadeToBlack",
                        data
                    }
                }
                return {
                    func: "mixEffects",
                    ME: parseInt(pathToChange.split('.')[2]),
                    data: state.video.mixEffects[pathToChange.split('.')[2]]
                }
            }
        },

        //When node red closes
        close() { },
    }
}