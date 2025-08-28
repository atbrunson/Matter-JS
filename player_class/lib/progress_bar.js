/**
 * @todo DEAR LORD PLEASE USE A DRAWING LIBRARY & REACT
 * @note DO NOT USE FOR RAPIDLY CHANGING VALUES!
 * @note Will divide by ZER0.
 *
 */

import { engine, render } from "../main.js";

/**
 * @class ProgressBar
 * @param {number} x position on the canvas
 * @param {number} y position on the canvas
 * @param {} refObj Object containing tracked property
 * @param {string} propPath string of the tracked property's path
 * @param {number} min smallest value of the tracked property
 * @param {number} max largest value of the tracked property
 */

class ProgressBar {
  constructor(x, y, refObj, propPath, min, max) {
    this.w = 20;
    this.h = 250;

    this.x = x;
    this.y = y;
    this.min = min;
    this.max = max;
    this.scale = this.h / (this.max - this.min);
    this.opacity = 0.75;

    this.trakr = {
      base: refObj,
      path: propPath,
    };

    this.value =
      this.scale * Matter.Common.get(this.trakr.base, this.trakr.path, -1); // refctr Common.get into this class as method

    this.value_prev = this.value;
    console.log("progress: ", this.value / this.h);

    //     this.value === 0 ?
    //         this.value + 0.0001
    //       : (this.progress = (this.value * this.h) / (this.max - this.min));
    //
    let colFilter = Matter.Body.nextCategory;

    this.bar = Matter.Composite.create({ label: "progressbar" });
    Matter.Composite.add(this.bar, [
      Matter.Bodies.rectangle(
        this.x + this.w / 2,
        this.y - this.h / 2,
        this.w,
        this.h,
        {
          label: "boarder",
          collisionFilter: {
            category: colFilter,
          },
          render: {
            visible: true,
            opacity: 0.75,
            strokeStyle: "lightgrey",
            fillStyle: "transparent",
            lineWidth: 1,
          },
        }
      ),

      Matter.Bodies.rectangle(
        this.x + this.w / 2,
        this.y - this.value / 2,
        this.w,
        this.value,
        {
          label: "filling",
          collisionFilter: {
            category: colFilter,
          },
          render: {
            visible: true,
            opacity: 0.75,
            strokeStyle: "transparent",
            fillStyle: "grey",
            lineWidth: 1,
          },
        }
      ),
    ]);
    Matter.World.add(document.engine.world, this.bar);

    Matter.Events.on(render, "afterRender", () => {
      this.update();
    });
  }

  update() {
    //ctx.fillStyle = `rgba(211, 211, 211, ${this.opacity})` //sett the color styles this way would be hard use d3.js
    //ctx.strokeStyle = `rgba(211, 211, 211, ${this.opacity})`
    const _boarder = this.bar.bodies[0];
    const _filling = this.bar.bodies[1];
    this.value =
      this.scale * Matter.Common.get(this.trakr.base, this.trakr.path, -1);

    if (this.value !== this.value_prev) {
      Matter.Body.scale(_filling, 0, this.value / this.h); //Broken
      console.log(this.value);
      let _mover = _boarder.bounds.max.y - _filling.bounds.max.y;
      Matter.Body.translate(_filling, { x: 0, y: _mover });
      this.value_prev = this.value;
    }
    if (this.value / this.h < 0.25) {
      this.bar.bodies[0].render.strokeStyle = "red";
      this.bar.bodies[0].render.opacity = 1;
      this.bar.bodies[1].render.fillStyle = "red";
      this.bar.bodies[1].render.opacity = 1;
    }
  }
  // //     /** TODO:
  // //      * select this.value:
  // //      *   >90% => baseColor & opacity 50%
  // //      *   >75% => baseColor & opacity 75%
  // //      *   >50% => baseColor + yellow & opacity 75%
  // //      *   >25% => baseColor + yellow/2 + red/2 & opacity 100%
  // //      * baseColor exapmle "lightgrey"
  // //      */
}

export { ProgressBar };
