import jsf from 'json-schema-faker'
import fs from 'fs';

const createObjectFile = (object, schema, n_intentional_right_cases) => {
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