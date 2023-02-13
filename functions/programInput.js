/**
 * Program Input
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

        handleStateChange(state, pathToChange) {
            if (pathToChange.includes("video.mixEffects")) {
                return state;
            }





            return undefined;
        },

        //When node red closes
        close() { },


    }
}