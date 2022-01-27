const fs = require('fs');
const axios = require('axios');

const main = async () => {
	try {
		const res = await axios.get('https://r.wdfl.co/rw.js');
		fs.writeFile('./static/js/rewardful-core.js', res.data, function (err) {
			err === null ? console.log('Success to make rewardful file') : console.log('Fail to make rewardful file');
		});
	} catch (error) {
		console.error(error);
	}
};

main();
