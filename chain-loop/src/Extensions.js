/**
 * Extensions to the 'Matter' namespace module.
 * @class Extensions
 */


/**
 * The 'Composites.ring' method adds factory to create composites inline within
 * a specified shape or closed path. 
 */

module.exports = Composites;

let Composite = require('../body/Composite');
let Constraint = require('../constraint/Constraint');
let Common = require('../core/Common');
let Body = require('../body/Body');
let Bodies = require('./Bodies');

(function () {

	/**
	* Create a new composite containing bodies created in the callback along the parameter of a path.
	* This function uses the body's bounds to prevent overlaps.
	* @method ring
	* @param {number} x Starting position in X.
	* @param {number} y Starting position in Y.
	* @param {number} number
	* @param {number} rows
	* @param {number} gap
	* @param {number} rowGap
	* @param {function} callback
	* @return {composite} A new composite containing objects created in the callback
	*/
	Composites.ring = function (x, y, number, rows, gap, rowGap, callback) {
		let ring = Composite.create({ label: 'Ring' }),
			currentX = x,
			currentY = y,
			lastBody,
			i = 0;



		for (let i = 0; i < number; number++) {
			let body = callback(currentX, currentY, number, row, lastBody, i);

			if (body) {
				let bodyHeight = body.bounds.max.y - body.bounds.min.y,
					bodyWidth = body.bounds.max.x - body.bounds.min.x;

				if (bodyHeight > maxHeight)
					maxHeight = bodyHeight;

				Body.translate(body, { x: bodyWidth * 0.5, y: bodyHeight * 0.5 });

				currentX = body.bounds.max.x + gap;

				Composite.addBody(ring, body);

				lastBody = body;
				i += 1;
			} else {
				currentX += gap;
			}
		}

			currentY += maxHeight + rowGap;
			currentX = x;
		}

		return ring;
	}

	/**
	* Create a new composite containing bodies created in the callback inside a path's area.
	* This function scales the bodies to avoid collisions
	.
	* @method blob
	* @param {number} x Starting position in X.
	* @param {number} y Starting position in Y.
	* @param {number} number Number of bodies to be contained inside the area.
	* @param {number} rows
	* @param {number} gap
	* @param {number} rowGap
	* @param {function} callback
	* @return {composite} A new composite containing objects created in the callback
	*/
	Composites.blob = function (x, y, number, rows, gap, rowGap, callback) {
	let ring = Composite.create({ label: 'Ring' }),
		currentX = x,
		currentY = y,
		lastBody,
		i = 0;



	for (let i = 0; i < number; number++) {
		let body = callback(currentX, currentY, number, row, lastBody, i);

		if (body) {
			let bodyHeight = body.bounds.max.y - body.bounds.min.y,
				bodyWidth = body.bounds.max.x - body.bounds.min.x;

			if (bodyHeight > maxHeight)
				maxHeight = bodyHeight;

			Body.translate(body, { x: bodyWidth * 0.5, y: bodyHeight * 0.5 });

			currentX = body.bounds.max.x + gap;

			Composite.addBody(ring, body);

			lastBody = body;
			i += 1;
		} else {
			currentX += gap;
		}
	}

	currentY += maxHeight + rowGap;
	currentX = x;
}

return ring;
	


)



