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
## Macro Properties
```javascript
{
    {
        topic: "function",
        payload: {
            function: "macroProperties",
            data: {
                isUsed: true/false,
                hasUnsupportedOps: true/false,
                name: "Macro",
                description: "This is a macro",
                macroId: 0
            }, 
            state: {
                // The state object
            }, 
            pathToChange: "macro.macroProperties.0" // Where the change came from specifically
        }
    }
}
```
## Macro Status
This is not working correctly! There is an issue with atem-connection's population of macro state
```javascript
{
    {
        topic: "function",
        payload: {
            function: "macroStatus",
            data: {
                isRunning: true/false,
                isWaiting: true/false,
                loop: true/false,
                macroIndex: 0,
                macro: {
                    //The macro object
                }
            }, 
            state: {
                // The state object
            }, 
            pathToChange: "macro.macroPlayer" // Where the change came from specifically
        }
    }
}
```