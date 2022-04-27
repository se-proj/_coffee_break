import jsf from 'json-schema-faker'
import fs from 'fs';

const createObjectFile = (test_settings) => {
	const {
		mongoose_schema,
		n_intentional_right_cases,
		n_intentional_wrong_cases,
		n_edge_cases,
	} = test_settings;

	// Have for loop here for size of mongoose_schema array
	// Also change obj.txt -> data.test.js
	const {schema} = mongoose_schema[0];

	const schemaAsObject = JSON.parse(schema);

	var filePath = 'obj.txt'; 
	fs.unlinkSync(filePath);

	let noOfData = n_intentional_right_cases;
	for (let i = 0; i < noOfData; i++) {
		const obj = jsf.generate(schemaAsObject);
		let sobj = JSON.stringify(obj)
		sobj = sobj + '\n';

		fs.appendFile(filePath, sobj, function (err) {
			if (err) throw err;
		});
	}
};

export default createObjectFile;