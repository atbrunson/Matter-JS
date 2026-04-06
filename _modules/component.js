/**
 * @module Component
 * @description	A structural component of a ship or station
 */

class Component{
	constructor(...dimensions){

		Matter.Body.create(...dimensions)
	}

}