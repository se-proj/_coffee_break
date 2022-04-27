/**
 * If there are any error in inputs, it is indicated by the global variable ERR_FLAG.
 * When ERR_FLAG is set to true:
 *      The program will NOT terminate and continue its normal execution unless it 
 *      recognizes all the missing mandatory inputs in the program and then end the
 *      execution without generating any file or writing any content.
 * When ERR_FLAG is set to false:
 *      The program will continue as programed, get all inputs and fit them in necessary 
 *      locations in global strings and then generate a file and write the content into
 *      the file. 
 */


import fs from 'fs'

let ERR_FLAG = false

let ROUTER_FILE_NAME = ""
let ROUTER_FILE_TEXT = ""

let BOILER_PLATE_DEPENDENCY_IMPORT = ""

let ROUTER_CLEAR_API = ""

/**
 * @description Add test router file path and name to ROUTER_FILE_NAME
 * @param {*} router_path 
 * @param {*} router_file_name 
 */
const addRouterFilePathName = (router_path, router_file_name) => {
    if(router_path[router_path.length - 1] !== "/" && router_path[router_path.length - 1] !== "\\") {
        if(router_path.includes("/"))
            router_path += "/"
        else if(router_path.includes("\\"))
            router_path += "\\"
        else
            router_path += "/"
    }

    let file_extension = router_file_name.substring(router_file_name.length - 3, router_file_name.length)
    if(file_extension !== ".js")
        router_file_name += ".js"

    ROUTER_FILE_NAME = router_path + router_file_name
}

/**
 * @description Added test router imports to BOILER_PLATE_DEPENDENCY_IMPORT 
 * and BOILER_PLATE_USER_IMPORT
 * @param {*} dependency_imports
 */
const addImports = (dependency_imports, mongoose_model) => {
    dependency_imports.forEach((dependencyImport) => {
        BOILER_PLATE_DEPENDENCY_IMPORT += "import "
        BOILER_PLATE_DEPENDENCY_IMPORT += dependencyImport.package_import
        BOILER_PLATE_DEPENDENCY_IMPORT += " from '"
        BOILER_PLATE_DEPENDENCY_IMPORT += dependencyImport.package_name
        BOILER_PLATE_DEPENDENCY_IMPORT += "'\n"
    })

    BOILER_PLATE_DEPENDENCY_IMPORT += "\n"

    mongoose_model.forEach((mongooseModel) => {
        BOILER_PLATE_DEPENDENCY_IMPORT += "import "
        BOILER_PLATE_DEPENDENCY_IMPORT += mongooseModel.name
        BOILER_PLATE_DEPENDENCY_IMPORT += " from '"
        BOILER_PLATE_DEPENDENCY_IMPORT += mongooseModel.path
        BOILER_PLATE_DEPENDENCY_IMPORT += "'\n"
    })
}

/**
 * @description Generate text for each async functions for delete api 
 * @param {*} model_name 
 */
const createDeleteAPIAsyncText = (model_name) => {
    let deleteAPIAsync = ""
    
    deleteAPIAsync += "\ttry {\n"
    deleteAPIAsync += "\t\tawait " + model_name + ".deleteMany({}, function (err) {\n"
    deleteAPIAsync += "\t\t\tconsole.log(\"All Documents from collection " + model_name + " are deleted\")\n"
    deleteAPIAsync += "\t\t\tres.status(200).json({message: \"All Documents from collection " + model_name + " are deleted\"})\n"
    deleteAPIAsync += "\t\t})\n"
    deleteAPIAsync += "\t}\n"
    deleteAPIAsync += "\tcatch(err) {\n"
    deleteAPIAsync += "\t\tconsole.log(\"Something went wrong while deleting all " + model_name + " documents\")\n"
    deleteAPIAsync += "\t\tres.status(404).json({ message: err.message })\n"
    deleteAPIAsync += "\t}\n"
    deleteAPIAsync += "\n"

    return deleteAPIAsync
}

//ROUTER_CLEAR_API
/**
 * @description Clear all collections present in the database using mongoose models
 * @param {*} mongoose_model 
 */
const addClearAPIs = (mongoose_model) => {
    ROUTER_CLEAR_API += "const deleteAllDocuments = async (req, res) => {\n"
    ROUTER_CLEAR_API += "\n"

    mongoose_model.forEach((mongooseModel) => {
        ROUTER_CLEAR_API += createDeleteAPIAsyncText(mongooseModel.name)
    })

    ROUTER_CLEAR_API += "}\n"
    ROUTER_CLEAR_API += "\n"
    ROUTER_CLEAR_API += "const router = express.Router()\n"
    ROUTER_CLEAR_API += "router.delete('/', deleteAllDocuments)\n"
    ROUTER_CLEAR_API += "\n"
    ROUTER_CLEAR_API += "export default router"
}

/**
 * @description Add all the router settings to ROUTER_FILE_NAME and ROUTER_FILE_TEXT
 * @param {*} router_settings 
 */
 const addRouterSettings = (router_settings) => {
    const { 
            router_path,
            router_file_name,
            dependency_imports,
            mongoose_model,
        } = router_settings

    if(router_path == undefined) {
        console.log("Please include the path location where you want your test_server file to be generated under\"router_path\"")
        ERR_FLAG = true
    }
    if(router_file_name == undefined) {
        router_file_name = "router.test.js"
    }
    if(dependency_imports == undefined) {
        dependency_imports = [
            {package_import: "express", package_name: "express"},
        ]
    }
    if(mongoose_model == undefined || mongoose_model == []) {
        console.log("Please add mongoose model array in the router_settings under \"mongoose_model\"")
        ERR_FLAG = true
    }
    
    if(!ERR_FLAG) {
        addRouterFilePathName(router_path, router_file_name)
        addImports(dependency_imports, mongoose_model)
        addClearAPIs(mongoose_model)

        ROUTER_FILE_TEXT += BOILER_PLATE_DEPENDENCY_IMPORT + "\n"
        ROUTER_FILE_TEXT += ROUTER_CLEAR_API
    }
}

/**
 * @description Create test router file and write ROUTER_FILE_TEXT into it
 * @param {*} router_settings 
 */
const createRouterFile = (router_settings) => {
    addRouterSettings(router_settings)

    if(!ERR_FLAG) {
        fs.writeFile(ROUTER_FILE_NAME, ROUTER_FILE_TEXT, (err) => {
            if(err) throw err
        })
    }
}

export default createRouterFile