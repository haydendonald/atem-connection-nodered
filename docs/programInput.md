# Program Input
## Output
```javascript
{
    {
        topic: "function",
        payload: {
            function: "programInput",
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
            pathToChange: "video.mixEffects.1.programInput" // Where the change came from specifically
        }
    }
}
```
## Change the Program Input
This will change the program input on a ME
```javascript
{
    {
        topic: "changeProgramInput",
        payload: {
            ME: 1, //The ME to change on, starting from ME 0

            //The input to set (only one required)
            inputId: 0, 
            inputLongName: "input",
            inputShortName: "in",
            ////
        }
    }
}
```