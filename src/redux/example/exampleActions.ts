import {ExampleAction, ExampleActionTypeKeys} from "./exampleTypes";

export const setAppName = (appname: string): ExampleAction => {
    return {
        type: ExampleActionTypeKeys.SET_APP_NAME,
        appname
    }
};