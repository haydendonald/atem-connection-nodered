# ATEM Connection for NodeRed
This package provides an interface between [BlackMagic ATEM](Blackmagic) switchers and NodeRed using the [ATEM Connection](https://github.com/nrkno/sofie-atem-connection) project by [Norsk rikskringkasting (NRK)](https://github.com/nrkno). This project is a continuation of the [BlackMagic ATEM NodeRed](https://github.com/haydendonald/blackmagic-atem-nodered) project as i can no longer support the ATEM side of the project.


# What's Supported?
* Direct control with [ATEM Connection](https://github.com/nrkno/sofie-atem-connection) with topics like stateChanged

# Output Messages
Below is a list of messages that can be sent out by the node:

## Connection State

```javascript
{
    {
        topic: "connection",
        payload: "connected/disconnected"
    }
}
```

## Info / Error / Debug / Command

```javascript
{
    {
        topic: "info/error/debug/command",
        payload: "" //The message
    }
}
```

## State Changed

```javascript
{
    {
        topic: "stateChanged",
        payload: {
            state: {} //The state object
            pathToChange: "" //The path
        }
    }
}
```

## Function Changed Example
This message is what is output when a function is supported by this project and has been translated. See the specific supported functions below.
```javascript
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
```
* [Program Input](https://github.com/haydendonald/atem-connection-nodered/blob/main/docs/previewInput.md): The program input for a specific mix effect 
* [Preview Input](https://github.com/haydendonald/atem-connection-nodered/blob/main/docs/programInput.md): The preview input for a specific mix effect 



# Thanks
[ATEM Connection](https://github.com/nrkno/sofie-atem-connection) project by [Norsk rikskringkasting (NRK)](https://github.com/nrkno) which provides the connection to the ATEM.