class ProgressBar {
    constructor(x, y, {valueRef}, max, min) {
        this.w = 5
        this.h = 250

        this.x = x + this.w / 2;
        this.y = y + this.h / 2;
        this.max = max;
        this.min = min;
        this.valueRef = valueRef
        this.value = valueRef.value
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
                    opacity: 1,
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
                    opacity: 1,
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

    update(){
         //look in the object referenced and get the current value
        this.value = this.valueRef.value;


        // calculate the progress based on the new value
        this.progress = this.value * this.h / (this.max - this.min)


        if (filling) {
            // Update height and position
            Matter.Body.setPosition(filling, {
                x: this.x,
                y: this.y + (this.h - this.progress) / 2 - 1
            });
            Matter.Body.scale(filling, 1, this.progress / filling.bounds.max.y - filling.bounds.min.y);
        }
    };

}
