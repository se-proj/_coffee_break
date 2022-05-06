/**
 * This file will be used to both create random objects using the mongoose model schema provided
 * by the user and generate a file exporting that object.
 */

import jsf from 'json-schema-faker'
import fs from 'fs';

/**
 * @description create random objects and generate a file containing it
 * @param {*} test_settings 
 */
const createObjectFile = (test_settings) => {
	const {
		mongoose_schema,
		n_intentional_right_cases,
		n_intentional_wrong_cases,
		n_edge_cases,
	} = test_settings;


	for(let i = 0; i<mongoose_schema.length; i++){
		const {schema} = mongoose_schema[i];
		const { name } = mongoose_schema[i];

		const schemaAsObject = JSON.parse(schema);

		var filePath = 'data.' + name + '.js'; 
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		
		let noOfData = n_intentional_right_cases;
		let sobj = "";

		sobj += "export const " + name + "_DATA = [ \n" 

		for (let k = 0; k < noOfData; k++) {
			const obj = jsf.generate(schemaAsObject);
			sobj += "\t"
			sobj += JSON.stringify(obj)
			sobj +=  ',\n';
		}
		sobj += "]";


		fs.writeFile(filePath, sobj, function (err) {
			if (err) throw err;
		});
	}
};

export default createObjectFile;