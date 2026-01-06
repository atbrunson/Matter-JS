/**
 * @todo DEAR LORD PLEASE USE A DRAWING LIBRARY & REACT
 * @note DO NOT USE FOR RAPIDLY CHANGING VALUES!
 * @note Will divide by ZER0.
 *
 */

import { engine, render } from "./main.js";
import Matter from "matter-js";
/**
 * @class GageBar
 * @param {number} x position on the canvas
 * @param {number} y position on the canvas
 * @param {} refObj Object containing tracked property
 * @param {string} propPath string of the tracked property's path
 * @param {number} min smallest value of the tracked property
 * @param {number} max largest value of the tracked property
 */

class GageBar {
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
    this.value = this.scale * Matter.Common.get(this.trakr.base, this.trakr.path, -1);
    this.value_prev = this.scale * Matter.Common.get(this.trakr.base, this.trakr.path, -1);

    console.log("Value ", this.value);

    //     this.value === 0 ?
    //         this.value + 0.0001
    //       : (this.progress = (this.value * this.h) / (this.max - this.min));
    //
    let ui_no_collision = Matter.Body.nextCategory;

    this.bar = Matter.Composite.create({ label: "meter" });
    Matter.Composite.add(this.bar, [
      Matter.Bodies.rectangle(
        this.x + this.w / 2,
        this.y - this.h / 2,
        this.w,
        this.h,
        {
          label: "boarder",
          isStatic: true,
          collisionFilter: {
            category: ui_no_collision,
          },
          render: {
            visible: true,
            opacity: 0.75,
            strokeStyle: "lightgrey",
            fillStyle: "rgba(32, 32, 32, 0.5)",
            lineWidth: 1,
          },
        }
      ),

      Matter.Bodies.rectangle(
        this.x + this.w / 2,
        this.y-2,
        this.w,
        4,
        {
          label: "needle",
          collisionFilter: {
            category: ui_no_collision,
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
    const _needle = this.bar.bodies[1];
    this.value = this.scale * Matter.Common.get(this.trakr.base, this.trakr.path, -1);

    if (this.value !== this.value_prev) {
    //   Matter.Body.setVertices(_needle, [
    //     { x: this.x, y: this.y }, //btm left
    //     { x: this.x, y: this.y - this.value }, //top left
    //     { x: this.x + this.w, y: this.y - this.value }, //top right
    //     { x: this.x + this.w, y: this.y }, //btm right
    //   ]);
      // Matter.Body.translate(_needle, {
      //   x: 0,
      //   y: this.value-this.value_prev,
      // });
      this.value_prev = this.value;

     // console.log(this.value - this.value_prev, this.value / this.h);
    }

    switch (true) {
      case Math.round(this.value) / this.h > .90:
        _boarder.render.strokeStyle = "red";
        _boarder.render.fillStyle = "rgba(212, 32, 32, 0.25)";
        _boarder.render.opacity = 0.75;
        _needle.render.fillStyle = "rgba(212, 32, 32, 0.50)";
        _needle.render.opacity = 0.75;
      break;
      
      case Math.round(this.value) / this.h > 0.80:
        _boarder.render.strokeStyle = "rgba(212, 148, 32, 0.50)";
        _boarder.render.fillStyle = "rgba(212, 148, 32, 0.25)";
        _boarder.render.opacity = 0.75;
        _needle.render.fillStyle = "rgba(212, 148, 32, 0.50)";
        _needle.render.opacity = 0.75;
      break;qqqq

      default:
        _needle.render.fillStyle = "grey";
        _needle.render.opacity = 0.75;
        _boarder.render.strokeStyle = "lightgrey";
        _boarder.render.opacity = 0.75;
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

export { GageBar };
