/**
 * 
 */

 let FUNCTION_TITLE_STRING = ""
 let DESCRIPTION_STRING = ""
 let FOR_CASE_STRING = ""
 let SERVER_QUERY_STRING = ""
 
 let STATUS_CHECK_STRING = ""
 let END_STRING = ""
 let NEW_FUNCTION_STRING = ""

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
    DESCRIPTION_STRING += "\tconst length = " + mongo_collection + "_DATA.length" + "\n"
}

const addForCaseString = () => {
    FOR_CASE_STRING += "\tfor(let i = 0; i < length; i++) {" + "\n"
    FOR_CASE_STRING += "\t\tapi_log += \"CASE \" + (i + 1) + " + "\":\\n\"" + "\n"
    FOR_CASE_STRING += "\t\ttry {" + "\n"
}

const addServerQueryString = (url, mongo_collection) => {
    SERVER_QUERY_STRING += `\t\t\tconst id = ${mongo_collection}_DATA[i]["_id"]`
    SERVER_QUERY_STRING += "\n"
    SERVER_QUERY_STRING += `\t\t\tconst res = await SERVER.delete(\`${url}`
    SERVER_QUERY_STRING += "/${id}\`)"
    SERVER_QUERY_STRING += "\n"
}

const addStatusCheckString = () => {
    STATUS_CHECK_STRING += `
            if(res.status >= 200 && res.status <= 299) {
                api_log += "status: " + res.status + "\\n"
            }
            else {
                error_flag = true
            }
`
}

const addEndString = (mongo_collection) => {
    END_STRING += `
        }
        catch(err) {
            error_flag = true
            console.log("Error while delete: ${mongo_collection}")
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

const addNewFunctionString = (newFunction) => {
    NEW_FUNCTION_STRING += `
    if(!ERROR)
        ${newFunction}()
    else
        console.log("TEST TERMINATED")
`
}

const createDeleteTest = (delete_api, nextFunction) => {
    const {
        api,
        func_name,
    } = delete_api

    addFunctionTitle(func_name)
    addDescriptionString(api.description, api.mongo_collection)
    addForCaseString()
    addServerQueryString(api.url, api.mongo_collection)
    addStatusCheckString()
    addEndString(api.mongo_collection)
    if(nextFunction !== null)
        addNewFunctionString(nextFunction)

    let return_string = ""
    return_string += FUNCTION_TITLE_STRING
    return_string += DESCRIPTION_STRING
    return_string += FOR_CASE_STRING
    return_string += SERVER_QUERY_STRING

    return_string += STATUS_CHECK_STRING

    return_string += END_STRING
    return_string += NEW_FUNCTION_STRING
    return_string += "}"

    return return_string
}

export default createDeleteTest