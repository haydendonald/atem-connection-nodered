# Mix Effect
Will control aspects of a mix effect block

# Actions
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
## Mix Effects
Will output when the function is not known but is related to a mix effect block
```javascript
{
    {
        topic: "function",
        payload: {
            function: "mixEffects",
            data: {
                ME: {
                    //The ME
                }
            }, 
            state: {
                // The state object
            }, 
            pathToChange: "" // Where the change came from specifically
        }
    }
}
```


## Program Input
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

## Preview Input
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

## Transition Position
```javascript
{
    {
        topic: "function",
        payload: {
            function: "transitionPosition",
            data: {
                ME: {
                    //The ME
                },
                inTransition: true/false,
                remainingFrames: 0,
                handlePosition: 0
            }, 
            state: {
                // The state object
            }, 
            pathToChange: "" // Where the change came from specifically
        }
    }
}
```

## Fade To Black
```javascript
{
    {
        topic: "function",
        payload: {
            function: "fadeToBlack",
            data: {
                ME: {
                    //The ME
                },
                rate: 0,
                isFullyBlack: true/false,
                inTransition: true/false,
                remainingFrames: 0
            }, 
            state: {
                // The state object
            }, 
            pathToChange: "" // Where the change came from specifically
        }
    }
}
```