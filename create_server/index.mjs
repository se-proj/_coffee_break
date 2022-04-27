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

let SERVER_FILE_NAME = ""
let SERVER_FILE_TEXT = ""

let BOILER_PLATE_DEPENDENCY_IMPORT = ""
let BOILER_PLATE_USER_IMPORT = ""
let BOILER_PLATE_ROUTER_IMPORT = ""

let EXPRESS_PARSER_MIDDLEWARE = ""
let USER_ROUTES = ""

let MONGODB_CONNECTION_URI = ""
let LOCALHOST_PORT = ""

let MOCHA_TESTING_PROMISE = ""

let LAST_RUN_BUILD_TEXT = ""

/**
 * @description Add test server file path and name to SERVER_FILE_NAME
 * @param {*} server_path 
 * @param {*} server_file_name 
 */
const addServerFilePathName = (server_path, server_file_name) => {
    if(server_path[server_path.length - 1] !== "/" && server_path[server_path.length - 1] !== "\\") {
        if(server_path.includes("/"))
            server_path += "/"
        else if(server_path.includes("\\"))
            server_path += "\\"
        else
            server_path += "/"
    }

    let file_extension = server_file_name.substring(server_file_name.length - 3, server_file_name.length)
    if(file_extension !== ".js")
        server_file_name += ".js"

    SERVER_FILE_NAME = server_path + server_file_name
    // SERVER_FILE_NAME = server_file_name
}

/**
 * @description Added test server imports to BOILER_PLATE_DEPENDENCY_IMPORT 
 * and BOILER_PLATE_USER_IMPORT
 * @param {*} dependency_imports 
 * @param {*} user_imports 
 */
const addImports = (dependency_imports, user_imports, router_file_name) => {
    dependency_imports.forEach((dependencyImport) => {
        BOILER_PLATE_DEPENDENCY_IMPORT += "import "
        BOILER_PLATE_DEPENDENCY_IMPORT += dependencyImport.package_import
        BOILER_PLATE_DEPENDENCY_IMPORT += " from '"
        BOILER_PLATE_DEPENDENCY_IMPORT += dependencyImport.package_name
        BOILER_PLATE_DEPENDENCY_IMPORT += "'\n"
    })
    
    user_imports.forEach((userImport) => {
        BOILER_PLATE_USER_IMPORT += "import "
        BOILER_PLATE_USER_IMPORT += userImport.user_import
        BOILER_PLATE_USER_IMPORT += " from '"
        BOILER_PLATE_USER_IMPORT += userImport.user_import_name
        BOILER_PLATE_USER_IMPORT += "'\n"
    })

    BOILER_PLATE_ROUTER_IMPORT += "import testRouter from './"
    BOILER_PLATE_ROUTER_IMPORT += router_file_name
    BOILER_PLATE_ROUTER_IMPORT += "'\n"
}

/**
 * @description Add express settings with limited data to EXPRESS_PARSER_MIDDLEWARE
 * @param {*} data_post_limit 
 */
const addExpressParserMiddleware = (data_post_limit) => {
    if(data_post_limit.substring(data_post_limit.length -2, data_post_limit.length) !== "mb")
        data_post_limit += "mb"
    let temp_json_limit = "limit: '" + data_post_limit + "'"

    EXPRESS_PARSER_MIDDLEWARE += "app.use(bodyParser.json({ "
    EXPRESS_PARSER_MIDDLEWARE += temp_json_limit
    EXPRESS_PARSER_MIDDLEWARE += ", extended: true }))\n"
    EXPRESS_PARSER_MIDDLEWARE += "app.use(bodyParser.urlencoded({ "
    EXPRESS_PARSER_MIDDLEWARE += temp_json_limit
    EXPRESS_PARSER_MIDDLEWARE += ", extended: true }))\n"
    EXPRESS_PARSER_MIDDLEWARE += "app.use(cors())\n"
}

/**
 * @description Add User api routes to USER_ROUTES
 * @param {*} user_routes 
 */
const addUserRoutes = (user_routes) => {
    user_routes.forEach((userRoute) => {
        USER_ROUTES += "app.use('"
        USER_ROUTES += userRoute.use_routes_base_url
        USER_ROUTES += "', "
        USER_ROUTES += userRoute.use_routes_import_name
        USER_ROUTES += ")\n"
    })
}

/**
 * @description Add mongoDB URI to MONGODB_CONNECTION_URI
 * @param {*} mongoDBURI 
 */
const addMongoDBURI = (mongoDBURI) => {
    MONGODB_CONNECTION_URI += "const dbURI = '"
    MONGODB_CONNECTION_URI += mongoDBURI
    MONGODB_CONNECTION_URI += "'\n"
}

/**
 * @description Add the port number to be used for connection to LOCALHOST_PORT
 * @param {*} port 
 */
const addPort = (port) => {
    LOCALHOST_PORT += "const PORT = process.env.PORT || "
    LOCALHOST_PORT += port
    LOCALHOST_PORT += "\n"
}

/**
 * @description Add mocha testing code to MOCHA_TESTING_PROMISE
 */
const addMochaTestingPromise = () => {
    MOCHA_TESTING_PROMISE += "// ES6 Promises (for enabling Mocha Testing)\n"
    MOCHA_TESTING_PROMISE += "mongoose.Promise = global.Promise\n"
}

/**
 * @description Add the remaining build, run and connect code to LAST_RUN_BUILD_TEXT
 */
const addLastRunBuildText = () => {
    LAST_RUN_BUILD_TEXT += "const connectDB = async () => {\n"
    LAST_RUN_BUILD_TEXT += "\ttry {\n"
    LAST_RUN_BUILD_TEXT += "\t\tawait mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })\n"
    LAST_RUN_BUILD_TEXT += "\t\tconsole.log('MongoDB connected...')\n"
    LAST_RUN_BUILD_TEXT += "\t} catch (err) {\n"
    LAST_RUN_BUILD_TEXT += "\t\tconsole.log('Error Detected')\n"
    LAST_RUN_BUILD_TEXT += "\t\tconsole.log(`${err} did not connect`)\n"
    LAST_RUN_BUILD_TEXT += "\t}\n"
    LAST_RUN_BUILD_TEXT += "}\n"
    LAST_RUN_BUILD_TEXT += "connectDB()\n"
    LAST_RUN_BUILD_TEXT += "\n"
    LAST_RUN_BUILD_TEXT += "app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`))\n"
    LAST_RUN_BUILD_TEXT += "mongoose.set('useFindAndModify', false)\n"
}

/**
 * @description Add all the server settings to SERVER_FILE_NAME and SERVER_FILE_TEXT
 * @param {*} server_settings 
 */
const addServerSettings = (server_settings, router_file_name) => {
    const { 
            server_path,
            server_file_name,
            dependency_imports,
            user_imports,
            data_post_limit,
            user_routes,
            mongoDBURI,
            port,
            mocha_testing_enabled,
        } = server_settings

    if(server_path == undefined) {
        console.log("Please include the path location where you want your test_server file to be generated under\"server_path\"")
        ERR_FLAG = true
    }
    if(server_file_name == undefined) {
        server_file_name = "server.test.js"
    }
    if(router_file_name == undefined) {
        router_file_name = "router.test.js"
    }
    if(dependency_imports == undefined) {
        dependency_imports = [
            {package_import: "express", package_name: "express"},
            {package_import: "bodyParser", package_name: "body-parser"},
            {package_import: "mongoose", package_name: "mongoose"},
            {package_import: "cors", package_name: "cors"},
        ]
    }
    if(user_imports == undefined || user_imports == []) {
        console.log("Please add the path of your API controllers in the server_settings under \"user_imports\"")
        ERR_FLAG = true
    }
    if(data_post_limit == undefined) {
        data_post_limit = "64mb"
    }
    if(user_routes == undefined || user_routes == []) {
        console.log("No API route to use. Please add respective API routes to server_settings under \"user_routes\"")
        ERR_FLAG = true
    }
    if(mongoDBURI == undefined) {
        console.log("Please provide a Mongo DB Atlas URI under \"mongoDBURI\"")
        ERR_FLAG = true
    }
    if(port == undefined) {
        port = "5100"
    }
    if(mocha_testing_enabled == undefined) {
        mocha_testing_enabled = true
    }
    
    if(!ERR_FLAG) {
        addServerFilePathName(server_path, server_file_name)
        addImports(dependency_imports, user_imports, router_file_name)
        addExpressParserMiddleware(data_post_limit)
        addUserRoutes(user_routes)
        addMongoDBURI(mongoDBURI)
        addPort(port)
        if(mocha_testing_enabled)
            addMochaTestingPromise()
        addLastRunBuildText()

        SERVER_FILE_TEXT += BOILER_PLATE_DEPENDENCY_IMPORT + "\n"
        SERVER_FILE_TEXT += BOILER_PLATE_USER_IMPORT + "\n"
        SERVER_FILE_TEXT += BOILER_PLATE_ROUTER_IMPORT + "\n"
        SERVER_FILE_TEXT += "const app = express()\n" + "\n"
        SERVER_FILE_TEXT += EXPRESS_PARSER_MIDDLEWARE + "\n"
        SERVER_FILE_TEXT += USER_ROUTES
        SERVER_FILE_TEXT += "app.use('/', testRouter)\n" + "\n"
        SERVER_FILE_TEXT += MONGODB_CONNECTION_URI
        SERVER_FILE_TEXT += LOCALHOST_PORT + "\n"
        if(mocha_testing_enabled)
            SERVER_FILE_TEXT += MOCHA_TESTING_PROMISE + "\n"
        SERVER_FILE_TEXT += LAST_RUN_BUILD_TEXT
    }
}

/**
 * @description Create test server file and write SERVER_FILE_TEXT into it
 * @param {*} server_settings 
 */
const createServerFile = (server_settings, router_file_name) => {
    addServerSettings(server_settings, router_file_name)

    if(!ERR_FLAG) {
        fs.writeFile(SERVER_FILE_NAME, SERVER_FILE_TEXT, (err) => {
            if(err) throw err
        })
    }
}

export default createServerFile