/**
 * Create a string for patch api for the test file
 */

let UPDATE_FUNCTION_STRING = ""

let FUNCTION_TITLE_STRING = ""
let DESCRIPTION_STRING = ""
let FOR_CASE_STRING = ""
let SERVER_QUERY_STRING = ""

let STATUS_CHECK_STRING = ""
let TYPE_CHECK_STRING = ""
let CHECK_DATA_STRING = ""
let END_STRING = ""
let NEW_FUNCTION_STRING = ""

// //////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////

/**
 * Add update function string
 */
const addUpdateFunction = () => {
    UPDATE_FUNCTION_STRING += `
const changeAttributesvalue = (query_data) => {
    Object.keys(query_data).forEach(function (key) {
        if (typeof (query_data[key]) === 'string') {
            const randomstring = Math.random().toString(36).substring(7);
            query_data[key] = query_data[key] + randomstring
        }
        if (typeof (query_data[key]) === 'object') {
            changeAttributesvalue(query_data[key]);
        }
        if (typeof (query_data[key]) === 'array') {
            for (let i = 0; i < query_data[key].length; i++) {
                changeAttributesvalue(query_data[key][i]);
            }
        }
        if (typeof (query_data[key]) === 'number') {
            const randomnum = Math.floor(Math.random() * 10);
            query_data[key] = query_data[key] + randomnum
        }
    });
}

const updateData = (query_data) => {
    for (let i = 0; i < query_data.length; i++) {
        changeAttributesvalue(query_data[i]);
    }
}
`
}

/**
 * @description Add function title string
 * @param {*} func_name 
 */
const addFunctionTitle = (func_name) => {
    FUNCTION_TITLE_STRING += `const ${func_name} = async () => {\n`
}

/**
 * @description Add description string
 * @param {*} func_name 
 */
const addDescriptionString = (description, mongo_collection) => {
    DESCRIPTION_STRING += "\tupdateData(PostMessage_DATA)" + "\n"
    DESCRIPTION_STRING += "\t// console.log(PostMessage_DATA)" + "\n"
    DESCRIPTION_STRING += "\tlet api_log = \"\\n\"" + "\n"
    DESCRIPTION_STRING += "\tlet error_flag = false" + "\n"
    DESCRIPTION_STRING += "\tapi_log += \"" + description + "\" + \"\\n\"" + "\n"
    DESCRIPTION_STRING += "\tconst length = " + mongo_collection + "_DATA.length" + "\n"
}

/**
 * 
 * @param {*} func_name 
 */
const addForCaseString = () => {
    FOR_CASE_STRING += "\tfor(let i = 0; i < length; i++) {" + "\n"
    FOR_CASE_STRING += "\t\tapi_log += \"CASE \" + (i + 1) + " + "\":\\n\"" + "\n"
    FOR_CASE_STRING += "\t\ttry {" + "\n"
}

/**
 * @description Add Server Query string
 * @param {*} url 
 * @param {*} mongo_collection 
 */
const addServerQueryString = (url, mongo_collection) => {
    SERVER_QUERY_STRING += `\t\t\tconst id = ${mongo_collection}_DATA[i]["_id"]`
    SERVER_QUERY_STRING += "\n"
    SERVER_QUERY_STRING += `\t\t\tconst res = await SERVER.delete(\`${url}`
    SERVER_QUERY_STRING += "/${id}\`, "
    SERVER_QUERY_STRING += `${mongo_collection}_DATA[i])`
    SERVER_QUERY_STRING += "\n"
}

/**
 * @description Add status check string
 * @param {*} url 
 * @param {*} mongo_collection 
 */
const addStatusCheckString = (right_status) => {
    STATUS_CHECK_STRING += `
            if(res.status !== ${right_status}) {
                api_log += "Incorrect Status: " + res.status + "\\n"
                error_flag = true
            }
            else
                api_log += "status: " + res.status + "\\n"
`
}

/**
 * @description Add Type check string
 * @param {*} url 
 * @param {*} mongo_collection 
 */
const addTypeCheckString = (type) => {
    TYPE_CHECK_STRING += `
            if(typeof(res.data) === '${type}' && len === undefined)
                api_log += "type: object\\n"
            else {
                api_log += "Object-type mis-match\\n"
                error_flag = true
            }
`
}

/**
 * @description Add check data string
 * @param {*} url 
 * @param {*} mongo_collection 
 */
const addCheckDataString = (filter_column, mongo_collection) => {
    CHECK_DATA_STRING += "\t\t\tconst filter_column = " + JSON.stringify(filter_column) + "\n"
    CHECK_DATA_STRING += `
            for(let j = 0; j < filter_column.length; j++) {
                if(!(filter_column[j] in res.data)) {
                    api_log += filter_column[j] + " is not present in object in position " + i + " of " + "${mongo_collection}"
                    api += "\\n"
                    error_flag = true
                }
                else {
                    if(${mongo_collection}_DATA[i][filter_column[j]] !== res.data[filter_column[j]]) {
                        api_log += "Value mis-match between resultant data and actual data in "
                        api += filter_column[j] + " at position " + i + " of " + "${mongo_collection}"
                        api += "\\n"
                        error_flag = true
                    }
                }
            }`
}

/**
 * @description Add end string
 * @param {*} mongo_collection 
 */
const addEndString = (mongo_collection) => {
    END_STRING += `
        }
        catch(err) {
            error_flag = true
            console.log("Error while patch: ${mongo_collection}")
            console.log(err)
        }
    }

    console.log(api_log)
    if(!error_flag)
        console.log("All cases successfully passed")
    else
        ERROR = true
`
}

/**
 * @description  Add new function string
 * @param {*} mongo_collection 
 */
const addNewFunctionString = (newFunction) => {
    NEW_FUNCTION_STRING += `
    if(!ERROR)
        ${newFunction}()
    else
        console.log("TEST TERMINATED")
`
}

/**
 * @description Create string for the provided patch api
 * @param {*} patch_api 
 * @param {*} nextFunction 
 * @returns 
 */
const createPatchTest = (patch_api, nextFunction) => {
    const {
        api,
        func_name,
    } = patch_api

    addUpdateFunction()
    addFunctionTitle(func_name)
    addDescriptionString(api.description, api.mongo_collection)
    addForCaseString()
    addServerQueryString(api.url, api.mongo_collection)
    addStatusCheckString(api.response_schema.right_status)
    addTypeCheckString(api.response_schema.type)
    addCheckDataString(api.response_schema.filter_column, api.mongo_collection)
    addEndString(api.mongo_collection)
    if(nextFunction !== null)
        addNewFunctionString(nextFunction)

    let return_string = ""
    return_string += UPDATE_FUNCTION_STRING + "\n"

    return_string += FUNCTION_TITLE_STRING
    return_string += DESCRIPTION_STRING
    return_string += FOR_CASE_STRING
    return_string += SERVER_QUERY_STRING

    return_string += STATUS_CHECK_STRING + "\n"
    return_string += "\t\t\tconst len = res.data.length" + "\n"
    return_string += TYPE_CHECK_STRING
    return_string += CHECK_DATA_STRING + "\n"

    return_string += END_STRING
    return_string += NEW_FUNCTION_STRING
    return_string += "}"

    return return_string
}

export default createPatchTest