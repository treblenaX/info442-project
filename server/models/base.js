import _ from "lodash";

export class Model {
    constructor(attributes = {}) {
        _.defaultsDeep(this, attributes, this.defaults);
    }

    toObject() {
        return {...this}
    }
}