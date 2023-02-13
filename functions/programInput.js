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
            //See if our path is included
            for(i in pathToChange) {
                if(pathToChange[i].includes("video.mixEffects") && pathToChange[i].includes(".programInput")) {
                    return {
                        ME: state.video.mixEffects[pathToChange[i].split('.')[2]],
                    }



                    // var ME = 
                    // var state = state.video.mixEffects[ME];
                    // state.ME = ME;
                    // state.pathToChange = pathToChange[i];
                    // return ret;
                }
            }

            return undefined;
        },

        //When node red closes
        close() { },


    }
}