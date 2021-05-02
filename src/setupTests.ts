import "@testing-library/jest-dom";
import chai from "chai";
import sinonChai from "sinon-chai";
import chaiDom from "chai-dom";

chai.should();
chai.use(sinonChai);
chai.use(chaiDom);
