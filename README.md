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
        "topic": "connection",
        "payload": "connected/disconnected"
    }
}
```

## Info / Error / Debug / Command

```javascript
{
    {
        "topic": "info/error/debug/command",
        "payload": "" //The message
    }
}
```

## State Changed

```javascript
{
    {
        "topic": "stateChanged",
        "state": {} //The state object
        "pathToChange": "" //The path
    }
}


```


# Thanks
[ATEM Connection](https://github.com/nrkno/sofie-atem-connection) project by [Norsk rikskringkasting (NRK)](https://github.com/nrkno) which provides the connection to the ATEM.