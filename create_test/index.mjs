

import fs from 'fs'

let ERR_FLAG = false

let FILE_TEXT = ""

const createTestFile = (test_settings) => {

    if(!ERR_FLAG) {
        fs.writeFile("api.test.js", FILE_TEXT, (err) => {
            if(err) throw err
        })
    }
}

export default createTestFile