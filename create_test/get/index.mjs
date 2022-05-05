



const createGetTest = (get_api, nextFunction) => {
    const {
        n_intentional_right_cases,
        n_intentional_wrong_cases,
        n_edge_cases,
        api,
        func_name,
    } = get_api

    return "PPP1"
}

export default createGetTest

let b = {
    n_intentional_right_cases: 20,
    n_intentional_wrong_cases: 0,
    n_edge_cases: 0,
    api: {
        description: 'GET posts FROM /posts',
        url: '/posts',
        http_type: 'GET',
        mongo_collection: 'PostMessage',
        mongoose_action: 'find',
        request_schema: {
            params: null,
            auth: null,
            header: null,
            body: {
                property: [
                    "title",
                    "message",
                    "creator",
                    "likes"
                ],
                schema: "post_schema"
            }
        },
        response_schema: {
            type: "object",
            filter_row: [],
            filter_column: [
                "title",
                "message",
                "creator",
                "likes"
            ],
            right_status: 201,
            wrong_occurence: [
                {status: 409, message: "#error.message"},
            ]
        }
    },
    func_name: 'get2_PostMessage'
}