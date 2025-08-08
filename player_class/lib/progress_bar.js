/**
 * @todo DEAR LORD PLEASE USE A DRAWING LIBRARY & REACT
 * @note DO NOT USE FOR RAPIDLY CHANGING VALUES!   
 * @note Will divide by ZER0.
 * 
*/

class ProgressBar {
    constructor(x, y, refObj, refProp, max, min) {
        this.w = 5
        this.h = 250

        this.x = x + this.w / 2;
        this.y = y + this.h / 2;
        this.max = max;
        this.min = min;
        this.delta = 0.0001
        this.refObj = refObj
        this.refProp = refProp
        if (this.refObj.hasOwnProperty(refProp)){
            this.value = this.refObj[this.refProp] // saving the value
        }
        this.value == 0 || this.value == undefined ? this.value = 0.0001 : this.value
        
        console.log(this.value, this.value == 0 || this.value == undefined)
        this.progress = this.value * this.h / (this.max - this.min)

        let colFilter = Body.nextCategory

        this.bar = Composite.create({ label: "progressbar" })
        Composite.add(this.bar, [
            Bodies.rectangle(this.x, this.y, this.w, this.h, {
                label: 'boarder',
                collisionFilter: {
                    category: colFilter
                },
                render: {
                    visible: true,
                    opacity: 0.75,
                    strokeStyle: "lightgrey",
                    fillStyle: "transparent",
                    lineWidth: 1
                }
            }),

            Bodies.rectangle(this.x, this.y + (this.h - this.progress) / 2 - 1, this.w, this.progress, {
                label: 'filling',
                collisionFilter: {
                    category: colFilter
                },
                render: {
                    visible: true,
                    opacity: .75,
                    strokeStyle: "transparent",
                    fillStyle: "grey",
                    lineWidth: 1,
                }
            })

        ])
        Events.on(engine, "beforeUpdate", () => {
            this.update();
        })

        Matter.World.add(engine.world, this.bar);
        console.log(this)

    }

    update() {
        
        let boarder = this.bar.bodies[0]
        let filling = this.bar.bodies[1]
        
        this.lastValue = this.refObj[this.refProp]
        this.progress = this.value * this.h / (this.max - this.min)
        this.lastProgress =  this.lastValue * this.h / (this.max - this.min)
        this.scalar = 1


        if (this.delta < this.lastProgress - this.progress) {
            console.log(`lV: ${this.lastValue} v: ${this.value} lP: ${this.lastProgress} p: ${this.progress}`)
            this.scalar = 1- Math.abs(this.lastProgress - this.progress)/this.lastProgress
            
            
            Matter.Body.scale(filling, 1, this.scalar)
            this.mover = (boarder.bounds.max.y - filling.bounds.max.y)
            Matter.Body.translate(filling, {x:0, y: this.mover })

            this.value = this.lastValue
        }

        //console.log(this.progress, this.lastProgress, this.scalar, this.value)
        
        /** TODO:
        * if progress:
        *   >90% => baseColor & opacity 50%
        *   >75% => baseColor & opacity 75%
        *   >50% => baseColor + yellow & opacity 75%
        *   >25% => baseColor + yellow/2 + red/2 & opacity 100%
        *   >10% => baseColor + red & opacity 100%
        *   > 5% => Red + BaseColor/2 & opcity 100%
        * baseColor exapmle "lightgrey"
        */
        



        //console.log(this.progress, this.value, this.lastValue)

        //look in the object referenced and get the current value
        // this.value = ship.fuel
        // this.progress = this.value * this.h / (this.max - this.min)
        // Body.scale(this.bar.bodies[1],1,this.progress)
        //console.log(this.progress)
        // // calculate the progress based on the new value
        // this.progress = this.value * this.h / (this.max - this.min)


        // if (filling) {
        //     // Update height and position
        //     Matter.Body.setPosition(filling, {
        //         x: this.x,
        //         y: this.y + (this.h - this.progress) / 2 - 1
        //     });
        //     Matter.Body.scale(filling, 1, this.progress / filling.bounds.max.y - filling.bounds.min.y);
        // }
    };

}
