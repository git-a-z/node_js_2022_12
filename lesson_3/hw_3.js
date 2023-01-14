import { createReadStream, createWriteStream } from 'fs';
import { createInterface } from 'readline';
import { EOL } from 'os';

const rs = createReadStream('./access_tmp.log');
const ws_89_123_1_41 = createWriteStream('./89.123.1.41_requests.log', { encoding: 'utf8', flags: 'a' });
const ws_34_48_240_111 = createWriteStream('./34.48.240.111_requests.log', { encoding: 'utf8', flags: 'a' });

const rl = createInterface({
	input: rs,
	crlfDelay: Infinity,
});

rl.on('line', (line) => {
	if (line.includes('89.123.1.41')) {
		ws_89_123_1_41.write(`${line}${EOL}`);
	} else if (line.includes('34.48.240.111')) {
		ws_34_48_240_111.write(`${line}${EOL}`);
	}
}).on('close', () => {
	console.log('File reading completed');
});
