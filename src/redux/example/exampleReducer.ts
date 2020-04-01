import {ExampleAction, ExampleActionTypeKeys, ExampleModel} from "./exampleTypes";
import {Reducer} from "redux";


export const initialExampleModel: ExampleModel = {
    appname: "Ontour Example Redux",
};

const exampleReducer: Reducer<ExampleModel, ExampleAction> = (
    state: ExampleModel = initialExampleModel,
    action: ExampleAction
) => {
    switch (action.type) {
        case ExampleActionTypeKeys.SET_APP_NAME: {
            return {
                appname: action.appname
            };
        }
        default:
            return state;
    }
};

export default exampleReducer
