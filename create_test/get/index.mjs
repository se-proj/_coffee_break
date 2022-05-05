/**
 * 
 */

 let FUNCTION_TITLE_STRING = ""
 let DESCRIPTION_STRING = ""
 let CASE_STRING = ""
 let SERVER_QUERY_STRING = ""
 
 let STATUS_CHECK_STRING = ""
 let TYPE_CHECK_STRING = ""
 let LENGTH_CHECK_STRING = ""
 let ID_INCLUDE_STRING = ""
 let CHECK_DATA_STRING = ""
 let END_STRING = ""
 let NEW_FUNCTION_STRING = ""

// //////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////        
//         if(error_flag) {
//             ERROR = true
//             throw err
//         }
//     }
//     catch(err) {
//         error_flag = true
//         api_log += "Error while get: PostMessage\n"
//         api_log += err
//         api_log += "\n"
//     }

//     console.log(api_log)
//     if(!error_flag)
//         console.log("%cAll cases successfully passed", "color: green")
// }
// //////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////

const addFunctionTitle = (func_name) => {
    FUNCTION_TITLE_STRING += `const ${func_name} = async () => {\n`
}

const addDescriptionString = (description, mongo_collection) => {
    DESCRIPTION_STRING += "\tlet api_log = \"\\n\"" + "\n"
    DESCRIPTION_STRING += "\tlet error_flag = false" + "\n"
    DESCRIPTION_STRING += "\tapi_log += \"" + description + "\" + \"\\n\"" + "\n"
}

const addCaseString = () => {
    CASE_STRING += "\ttry {" + "\n"
}

const addServerQueryString = (url, mongo_collection) => {
    SERVER_QUERY_STRING += `\t\tconst res = await SERVER.get(\`${url}\`)`
    SERVER_QUERY_STRING += "\n"
}

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

const addTypeCheckString = (type) => {
    TYPE_CHECK_STRING += `
        if(typeof(res.data) === '${type}' && len !== undefined)
            api_log += "type: array-object\\n"
        else {
            api_log += "Object-type mis-match\\n"
            error_flag = true
        }
`
}

const addLengthCheckString = (mongo_collection) => {
    LENGTH_CHECK_STRING += `
        if(len !== undefined) {
            api_log += "length: " + len + "\n"
            if(len !== ${mongo_collection}_DATA.length) {
                api_log += "Length Does not match\n"
                error_flag = true
            }
        }
        else {
            api_log += "Length is undefined\n"
            error_flag = true
        }
`
}

const addCheckDataString = (filter_column, mongo_collection) => {
    CHECK_DATA_STRING += "\t\tconst filter_column = " + JSON.stringify(filter_column) + "\n"
    CHECK_DATA_STRING += `
        for(let i = 0; i < len; i++) {
            for(let j = 0; j < filter_column.length; j++) {
                if(!(filter_column[j] in res.data[i])) {
                    api_log += filter_column[j] + " is not present in object in position " + i + " of " + "${mongo_collection}"
                    api += "\\n"
                    error_flag = true
                }
                else {
                    if(${mongo_collection}_DATA[i][filter_column[j]] !== res.data[i][filter_column[j]]) {
                        api_log += "Value mis-match between resultant data and actual data in "
                        api += filter_column[j] + " at position " + i + " of " + "${mongo_collection}"
                        api += "\\n"
                        error_flag = true
                    }
                }
            }
        }`
}

const addEndString = (mongo_collection) => {
    END_STRING += `
    }
    catch(err) {
        error_flag = true
        console.log("Error while post: ${mongo_collection}")
        console.log(err)
    }

    console.log(api_log)
    if(!error_flag)
        console.log("All cases successfully passed")
    else
        ERROR = true
`
}

const addNewFunctionString = (newFunction) => {
    NEW_FUNCTION_STRING += `
    if(!ERROR)
        ${newFunction}()
    else
        console.log("TEST TERMINATED")
`
}

const createGetTest = (get_api, nextFunction) => {
    const {
        api,
        func_name,
    } = get_api

    addFunctionTitle(func_name)
    addDescriptionString(api.description, api.mongo_collection)
    addCaseString()
    addServerQueryString(api.url, api.mongo_collection)
    addStatusCheckString(api.response_schema.right_status)
    addTypeCheckString(api.response_schema.type)
    addLengthCheckString(api.mongo_collection)
    addCheckDataString(api.response_schema.filter_column, api.mongo_collection)
    addEndString(api.mongo_collection)
    if(nextFunction !== null)
        addNewFunctionString(nextFunction)

    let return_string = ""
    return_string += FUNCTION_TITLE_STRING
    return_string += DESCRIPTION_STRING
    return_string += CASE_STRING
    return_string += SERVER_QUERY_STRING

    return_string += STATUS_CHECK_STRING + "\n"
    return_string += "\t\tconst len = res.data.length" + "\n"
    return_string += TYPE_CHECK_STRING

    return_string += ID_INCLUDE_STRING + "\n"

    return_string += CHECK_DATA_STRING
    return_string += END_STRING
    return_string += NEW_FUNCTION_STRING
    return_string += "}"

    return return_string
}

export default createGetTest