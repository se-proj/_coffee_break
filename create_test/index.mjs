/**
 * 
 */

import createGetTest from './get/index.mjs'
import createPostTest from './post/index.mjs'
import createPatchTest from './patch/index.mjs'
import createDeleteTest from './delete/index.mjs'
import fs from 'fs'

let ERR_FLAG = false

const FILE_NAME = "api.test.js"
let FILE_TEXT = ""

let NECESSARY_IMPORT_TEXT = ""
let DATA_IMPORT_TEXT = ""

let SERVER_AXIOS_TEXT = ""

let BEFORE_APICALL_TEXT = ""

let TEST_TEXT = ""

const addNecessaryImports = () => {
    NECESSARY_IMPORT_TEXT += "import axios from 'axios'\n"
}

const addDataImports = (mongoose_schema) => {
    mongoose_schema.forEach((mschema) => {
        const { name } = mschema
        DATA_IMPORT_TEXT += "import { " + name + "_DATA } from '"
        DATA_IMPORT_TEXT += "./data." + name + ".js'" + "\n"
    })
}

const addServerAxios = (port_num) => {
    SERVER_AXIOS_TEXT += "const SERVER = axios.create({baseURL: "
    SERVER_AXIOS_TEXT += `"http://localhost:${port_num}"})`
    SERVER_AXIOS_TEXT += "\n"
}

const addBeforeAPICall = () => {
    BEFORE_APICALL_TEXT += `
const before = async () => {
    try {
        const res = await SERVER.delete('/', {})
        console.log(res.data)
    }
    catch(err) {
        console.log("before() function failed")
        console.log(err)
    }
}
    `
}

const addTestFunctions = (test_settings) => {
    const {
        n_intentional_right_cases,
        n_intentional_wrong_cases,
        n_edge_cases,
        apis
    } = test_settings

    apis.forEach((api) => {
        const {
            http_type,
        } = api

        let api_par = {
            n_intentional_right_cases: n_intentional_right_cases,
            n_intentional_wrong_cases: n_intentional_wrong_cases,
            n_edge_cases: n_edge_cases,
            api: api,
        }

        let api_str = ""
        switch(http_type) {
            case "GET":
                api_str = createGetTest(api_par)
                break;
            case "POST":
                api_str = createPostTest(api_par)
                break;
            case "PATCH":
                api_str = createPatchTest(api_par)
       
                break;
            case "DELETE":
                api_str = createDeleteTest(api_par)
                break;
            default:
                break;
        }
        TEST_TEXT += "\n"
        TEST_TEXT += api_str
        TEST_TEXT += "\n"
    });
}

const compileAllFileText = () => {
    FILE_TEXT += NECESSARY_IMPORT_TEXT + "\n"
    FILE_TEXT += DATA_IMPORT_TEXT + "\n"
    FILE_TEXT += SERVER_AXIOS_TEXT
    FILE_TEXT += BEFORE_APICALL_TEXT + "\n"
    FILE_TEXT += "let ERROR = false\n\n"

    FILE_TEXT += "// ///////////////////////" + "\n"
    FILE_TEXT += "// BEGIN TESTS" + "\n"
    FILE_TEXT += "// ///////////////////////" + "\n"
    FILE_TEXT += TEST_TEXT + "\n"
    FILE_TEXT += "// ///////////////////////" + "\n"
    FILE_TEXT += "// END TESTS" + "\n"
    FILE_TEXT += "// ///////////////////////" + "\n"
}

const createTestFile = (test_settings) => {
    addNecessaryImports()
    addDataImports(test_settings.mongoose_schema)
    addServerAxios(test_settings.server_settings.port)
    addBeforeAPICall()
    addTestFunctions(test_settings)

    compileAllFileText()

    if(!ERR_FLAG) {
        fs.writeFile(FILE_NAME, FILE_TEXT, (err) => {
            if(err) throw err
        })
    }
}

export default createTestFile