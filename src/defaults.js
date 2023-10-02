"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaults = void 0;
const defaults = {
	console: {},
};
const setDefaults = (request = {}) => {
	return Object.assign(Object.assign({}, defaults), request);
};
exports.setDefaults = setDefaults;
