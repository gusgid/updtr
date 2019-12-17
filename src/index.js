import path from "path";
import fs from "fs";
import run from "./run";
import Updtr from "./Updtr";
import * as errors from "./errors";
import reporters from "./reporters";
import {
    USE_NPM,
    USE_YARN,
    UPDATE_TO_OPTIONS,
    SAVE_OPTIONS,
} from "./constants/config";

export function create(config) {
    return new Updtr(config);
}

export function start(inputConfig = {}) {
    const reporterNames = Object.keys(reporters);
    const pathToYarnLock = path.join(process.cwd(), "yarn.lock");
    const useDefault = fs.existsSync(pathToYarnLock) === true ? USE_YARN : USE_NPM;
    const defaultConfig = {
        use: useDefault,
        exclude: [],
        updateTo: UPDATE_TO_OPTIONS[0],
        save: SAVE_OPTIONS[0],
        reporter: reporterNames[0],
        test: "",
        testStdout: false,
        registry: undefined,
        cwd: process.cwd(),
    };
    const config = { ...defaultConfig, ...inputConfig };
    const reporterConfig = {
        stream: undefined,
        testStdout: config.testStdout,
    };
    const updtr = create(config);

    reporters[config.reporter](updtr, reporterConfig);

    return run(updtr);
}

export { errors, run };