import Matter from "matter-js";

const engine = Matter.Engine.create();
const boxEl = document.querySelector("#box");
const boxW = boxEl.offsetWidth;
const boxH = boxEl.offsetHeight;
const box = {
  body: Matter.Bodies.rectangle(50, 0, boxW, boxH),
  elem: boxEl,
  render() {
    const { x, y } = this.body.position;
    this.elem.style.top = `${y - boxW / 2}px`;
    this.elem.style.left = `${x - boxH / 2}px`;
    this.elem.style.transform = `rotate(${this.body.angle}rad)`;
  },
};
const ground = Matter.Bodies.rectangle(200, 200, 900, 120, { isStatic: true });
const mouseConstraint = Matter.MouseConstraint.create(engine, {
  element: document.body,
});
Matter.Composite.add(engine.world, [box.body, ground, mouseConstraint]);
(function rerender() {
  box.render();
  Matter.Engine.update(engine);
  requestAnimationFrame(rerender);
})();

// TODO:
// - Create class to handle new dom elements (see svgBody.js)
// - Integrate style elements with body.render --> create map to style properties
// - Integrate with svg elements