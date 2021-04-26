// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");

chai.should();
chai.use(sinonChai);
