import { UAParser } from 'ua-parser-js';

const getType = () => {
    const parser = UAParser();
    const deviceType = parser.device.type;

    return deviceType;
}

export default getType;