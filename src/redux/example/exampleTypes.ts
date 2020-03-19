export interface ExampleModel {
    appname: string;
}


export type ExampleAction
    = SetAppName

export enum ExampleActionTypeKeys {
    SET_APP_NAME = "SET_APP_NAME"
}

export interface SetAppName {
    type: ExampleActionTypeKeys.SET_APP_NAME,
    appname: string
}
