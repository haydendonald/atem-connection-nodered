##  Get the state of the ATEM
This will return the current state of a mix effect block
```javascript
{
    {
        topic: "getState",
        payload: {}
    }
}
```
##  Get the state of a mix efect block
This will return the current state of a mix effect block
```javascript
{
    {
        topic: "getMixEffectBlock",
        payload: {
            ME: 1 //The ME to get, starting from ME 0
        }
    }
}
```
