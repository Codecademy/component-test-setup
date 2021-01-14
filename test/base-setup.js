// https://github.com/enzymejs/enzyme/issues/2429
const Adapter = require("@wojtekmaj/enzyme-adapter-react-17");
const Enzyme = require("enzyme");

Enzyme.configure({ adapter: new Adapter() });
