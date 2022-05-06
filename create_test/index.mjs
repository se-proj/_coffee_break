/**
 * Create test generation files by utilising all the files: get, post, patch and delete
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

/**
 * @description Add necessary test imports for the test file
 */
const addNecessaryImports = () => {
    NECESSARY_IMPORT_TEXT += "import axios from 'axios'\n"
}

/**
 * @description Add random data object imports for the test file
 * @param {*} mongoose_schema 
 */
const addDataImports = (mongoose_schema) => {
    mongoose_schema.forEach((mschema) => {
        const { name } = mschema
        DATA_IMPORT_TEXT += "import { " + name + "_DATA } from '"
        DATA_IMPORT_TEXT += "./data." + name + ".js'" + "\n"
    })
}

/**
 * @description Add create server instance string
 * @param {*} port_num 
 */
const addServerAxios = (port_num) => {
    SERVER_AXIOS_TEXT += "const SERVER = axios.create({baseURL: "
    SERVER_AXIOS_TEXT += `"http://localhost:${port_num}"})`
    SERVER_AXIOS_TEXT += "\n"
}

/**
 * @description Add Before API Call string
 * @param {*} nextFunction 
 */
const addBeforeAPICall = (nextFunction) => {
    BEFORE_APICALL_TEXT += `
const before = async () => {
    try {
        const res = await SERVER.delete('/', {})
        console.log(res.data)
    }
    catch(err) {
        ERROR = true
        console.log("before() function failed")
        console.log(err)
    }
    finally {
        if(!ERROR)
            ${nextFunction}()
        else
            console.log("TEST TERMINATED")
    }
}
`
}

/**
 * @description Get api array that is necessariliy modified with function names for test file
 * @param {*} test_settings 
 * @returns api array
 */
const getAPIArray = (test_settings) => {
    const {
        n_intentional_right_cases,
        n_intentional_wrong_cases,
        n_edge_cases,
        apis
    } = test_settings

    let func_index = 1
    let api_par_array = []

    apis.forEach((api) => {
        const {
            http_type,
            mongo_collection
        } = api

        let api_par = {
            n_intentional_right_cases: n_intentional_right_cases,
            n_intentional_wrong_cases: n_intentional_wrong_cases,
            n_edge_cases: n_edge_cases,
            api: api,
        }

        switch(http_type) {
            case "GET":
                api_par["func_name"] = ("get" + func_index + "_" + mongo_collection)
                break;
            case "POST":
                api_par["func_name"] = ("post" + func_index + "_" + mongo_collection)
                break;
            case "PATCH":
                api_par["func_name"] = ("patch" + func_index + "_" + mongo_collection)
                break;
            case "DELETE":
                api_par["func_name"] = ("delete" + func_index + "_" + mongo_collection)
                break;
            default:
                break;
        }

        func_index++
        api_par_array.push(api_par)
    })

    return api_par_array
}

/**
 * @description Add Test case string
 * @param {*} api_par 
 * @param {*} nextFunction 
 */
const addTestCaseString = (api_par, nextFunction) => {
    const {
        http_type
    } = api_par.api

    let api_str = ""
    switch(http_type) {
        case "GET":
            api_str = createGetTest(api_par, nextFunction)
            break;
        case "POST":
            api_str = createPostTest(api_par, nextFunction)
            break;
        case "PATCH":
            api_str = createPatchTest(api_par, nextFunction)
            break;
        case "DELETE":
            api_str = createDeleteTest(api_par, nextFunction)
            break;
        default:
            break;
    }

    TEST_TEXT += "\n"
    TEST_TEXT += api_str
    TEST_TEXT += "\n"
}

/**
 * @description Add test Functions for api array
 * @param {*} api_par_array 
 */
const addTestFunctions = (api_par_array) => {
    const len = api_par_array.length
    for(let i = 0; i < len; i++) {
        const api_par = api_par_array[i]

        if(i === len - 1)
            addTestCaseString(api_par, null)
        else
            addTestCaseString(api_par, api_par_array[i + 1].func_name)
    }
}

/**
 * @description Compile the different string for final Test file
 */
const compileAllFileText = () => {
    FILE_TEXT += NECESSARY_IMPORT_TEXT + "\n"
    FILE_TEXT += DATA_IMPORT_TEXT + "\n"
    FILE_TEXT += SERVER_AXIOS_TEXT + "\n"
    FILE_TEXT += "let ERROR = false\n"
    FILE_TEXT += BEFORE_APICALL_TEXT + "\n"

    FILE_TEXT += "// ///////////////////////" + "\n"
    FILE_TEXT += "// BEGIN TESTS" + "\n"
    FILE_TEXT += "// ///////////////////////" + "\n"
    FILE_TEXT += TEST_TEXT + "\n"
    FILE_TEXT += "// ///////////////////////" + "\n"
    FILE_TEXT += "// END TESTS" + "\n"
    FILE_TEXT += "// ///////////////////////" + "\n"

    FILE_TEXT += "\nbefore()"
}

/**
 * @description Create Test file with the test file text
 * @param {*} test_settings 
 */
const createTestFile = (test_settings) => {
    addNecessaryImports()
    addDataImports(test_settings.mongoose_schema)
    addServerAxios(test_settings.server_settings.port)
    let api_par_array = getAPIArray(test_settings)
    addBeforeAPICall(api_par_array[0].func_name)
    addTestFunctions(api_par_array)

    compileAllFileText()

    if(!ERR_FLAG) {
        fs.writeFile(FILE_NAME, FILE_TEXT, (err) => {
            if(err) throw err
        })
    }
}

export default createTestFile