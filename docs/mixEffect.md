# Mix Effect
Will control aspects of a mix effect block

# Actions
## Auto Transition
This will perform an auto transition on an ME
```javascript
{
    {
        topic: "autoTransition",
        payload: {
            ME: 0
        }
    }
}
```

## Cut
This will perform a cut on an ME
```javascript
{
    {
        topic: "cut",
        payload: {
            ME: 0
        }
    }
}
```

## Fade To Block
This will perform a fade to black on an ME
```javascript
{
    {
        topic: "fadeToBlack",
        payload: {
            ME: 0
        }
    }
}
```

## Set Transition Position
This will set a transition position to a ME
```javascript
{
    {
        topic: "setTransitionPosition",
        payload: {
            ME: 0,
            position: 0 // From 0 - 32767
        }
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