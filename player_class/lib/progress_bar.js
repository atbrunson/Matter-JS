/**
 * @todo DEAR LORD PLEASE USE A DRAWING LIBRARY & REACT
 * @note DO NOT USE FOR RAPIDLY CHANGING VALUES!   
 * @note Will divide by ZER0.
 * 
*/

let Bodies = Matter.Bodies
let Events = Matter.Events



/**
 * @class ProgressBar
 * @param {number} x position on the canvas
 * @param {number} y position on the canvas
 * @param {} refObj Object containing tracked property
 * @param {string} propPath string of the tracked property's path
 * @param {number} min smallest value of the tracked property
 * @param {number} mas largest value of the tracked property
 */

class ProgressBar {
    constructor(x, y, refObj, propPath, max, min) {
        this.w = 5
        this.h = 250

        this.x = x + this.w / 2;
        this.y = y + this.h / 2;
        this.max = max;
        this.min = min;
        this.opacity = 0.75


        //Impliment common.get(refObject,"path")
        this.obj = Matter.Common.get(refObject,propPath)

        
        
        //This ensures that the property is exsits
        if (this.refObj.hasOwnProperty(propPath)){
            this.value = this.refObj[this.propPath] // saving here the value
        }
        this.value === 0 ? this.value + 0.0001 :

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
        Events.on(engine, "afterREnder", () => this.update())
        Matter.World.add(engine.world, this.bar);
        console.log(this)


    }

    update() {
        
        //ctx.fillStyle = `rgba(211, 211, 211, ${this.opacity})` // filling the color style this way would be hard perhaps paper.js or p5-js
        //ctx.strokeStyle = `rgba(211, 211, 211, ${this.opacity})`

        let boarder = this.bar.bodies[0]
        let filling = this.bar.bodies[1]
        
        this.lastValue = this.refObj[this.propPath]
        this.progress = this.value * this.h / (this.max - this.min)
        this.lastProgress =  this.lastValue * this.h / (this.max - this.min)
        this.scalar = 1


        if (this.lastProgress != this.progress) {
            console.log(`lV: ${this.lastValue} v: ${this.value} lP: ${this.lastProgress} p: ${this.progress}`)
            
            this.scalar = 1- Math.abs(this.lastProgress - this.progress)/this.lastProgress
            
            
            Matter.Body.scale(filling, 1, this.scalar)
            this.mover = (boarder.bounds.max.y - filling.bounds.max.y)
            Matter.Body.translate(filling, {x:0, y: this.mover })

            this.value = this.lastValue
        }

        if (this.lastProgress/this.h < 0.25){
            this.bar.bodies[0].render.strokeStyle = "red"
            this.bar.bodies[0].render.opacity = 1
            this.bar.bodies[1].render.fillStyle = "red"         
            this.bar.bodies[1].render.opacity = 1    
            }

                
        /** TODO:
        * if progress:
        *   >90% => baseColor & opacity 50%
        *   >75% => baseColor & opacity 75%
        *   >50% => baseColor + yellow & opacity 75%
        *   >25% => baseColor + yellow/2 + red/2 & opacity 100%
        * baseColor exapmle "lightgrey"
        */

    };

}
