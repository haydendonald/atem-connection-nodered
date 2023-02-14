# Macro
Will control the macros on the ATEM

# Actions
## Run Macro
This will run a macro
```javascript
{
    {
        topic: "macroRun",
        payload: {
            //The macro to run (only one required)
            macroId: 0, 
            macroName: "input"
            ////
        }
    }
}
```

## Stop Current Macro
This will stop all running macros
```javascript
{
    {
        topic: "macroStop",
        payload: {}
    }
}
```

## Continue Current Macro
This will continue all stopped macros
```javascript
{
    {
        topic: "macroContinue",
        payload: {}
    }
}
```

# Output
```javascript
{
    {
        topic: "function",
        payload: {
            function: "macro",
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