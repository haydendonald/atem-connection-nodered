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
                case "macroRun": {
                    //Find the macro id
                    var Id;
                    if (payload.macroId !== undefined) { Id = payload.macroId; }
                    else if (payload.macroName !== undefined) {
                        for (var i in atem.state.macro.macroProperties) {
                            if (atem.state.macro.macroProperties[i].macroName == payload.macroName) { Id = parseInt(i); break; }
                        }
                    }
                    else {
                        callback(false, "The macro was missing, macroId, macroName is required");
                        return true;
                    }
                    if (Id === undefined) {
                        callback(false, "The macro was not found");
                        return true;
                    }

                    //Execute
                    atem.macroRun(Id).then(() => {
                        callback(true, `macro ${id} ran`);
                    }).catch(() => {
                        callback(false);
                    });

                    return true;
                }
                case "macroContinue": {
                    atem.macroContinue().then(() => {
                        callback(true, "macro continued");
                    }).catch(() => {
                        callback(false);
                    });
                    return true;
                }
                case "macroStop": {
                    atem.macroStop().then(() => {
                        callback(true, "macro stopped");
                    }).catch(() => {
                        callback(false);
                    });
                    return true;
                }
            }
        },

        //Handle an incoming state change
        handleStateChange(state, pathToChange) {
            if (pathToChange.includes("macro")) {
                if (pathToChange.includes(".macroProperties")) {
                    var data = state.macro.macroProperties[pathToChange.split('.')[2]];
                    data.macroId = pathToChange.split('.')[2];
                    return {
                        func: "macroProperties",
                        data
                    }
                }
                else if (pathToChange.includes(".macroPlayer")) {
                    var data = state.macro.macroPlayer;
                    data.notes = "As of development, this doesn't seem to work correctly in the atem-connection project but it's implemented here incase they fix it";
                    data.macro = state.macro.macroPlayer[state.macro.macroPlayer.macroIndex];
                    return {
                        func: "macroStatus",
                        data
                    }
                }
            }
        },

        //When node red closes
        close() { },
    }
}