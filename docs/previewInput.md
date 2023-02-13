# Preview Input
## Output
```javascript
{
    {
        topic: "function",
        payload: {
            function: "previewInput",
            data: {
                ME: {
                    //The ME
                }
                input: {
                    //The input that was selected
                }
            }, 
            state: {
                // The state object
            }, 
            pathToChange: "video.mixEffects.1.previewInput" // Where the change came from specifically
        }
    }
}
```
## Change the Preview Input
This will change the preview input on a ME
```javascript
{
    {
        topic: "changePreviewInput",
        payload: {
            ME: 1, //The ME to change on, starting from ME 1

            //The input to set (only one required)
            inputId: 0, 
            inputLongName: "input",
            inputShortName: "in",
            ////
        }
    }
}
```