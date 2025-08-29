# Player Class Notes

## Ship Object

- [ ] Single pulse thrust
  
## Crew Object

- [ ] task execution


``` mermaid
---
  title: Class Integration 
---
classDiagram

class Player{
  +x horizontal starting position
  +y vertical starting position
  +move(direction) moves the player 
}

class KeyboardControl{
  +assignedKeys : object
  +activeKeys : array
  +bindKey()
  +UnbindKey()
}

class Ship{
  +fuel
  +update()
}


```
