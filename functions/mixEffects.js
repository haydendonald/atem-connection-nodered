/**
 * The mix effects handler
 * By Hayden Donald 2023
 */

module.exports = function () {
    return {
        /**
         * Handle the incoming message from the flow
         * @param {*} data The data object
         * @param {*} callback The callback for the completion func(success, data)
         */
        handleFlow(data, callback) {

        },

        //Handle an incoming program input
        handleProgramInputChange(state, pathToChange) {
            return {
                func: "programInput",
                data: {
                    ME: state.video.mixEffects[pathToChange.split('.')[2]],
                    programInput: state.video.mixEffects[pathToChange.split('.')[2]].programInput
                }
            }
        },

        //Handle an incoming preview input
        handlePreviewInputChange(state, pathToChange) {
            return {
                func: "previewInput",
                data: {
                    ME: state.video.mixEffects[pathToChange.split('.')[2]],
                    previewInput: state.video.mixEffects[pathToChange.split('.')[2]].previewInput
                }
            }
        },

        //Handle an incoming state change
        handleStateChange(state, pathToChange) {
            if (pathToChange.includes("video.mixEffects")) {
                if (pathToChange.includes(".programInput")) {
                    return this.handleProgramInputChange(state, pathToChange);
                }
                if (pathToChange.includes(".previewInput")) {
                    return this.handlePreviewInputChange(state, pathToChange);
                }
            }
        },

        //When node red closes
        close() { },


    }
}