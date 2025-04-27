let BASE_URL = ''

if (process.env.NODE_ENV == 'development') {
	// BASE_URL = 'http://10.8.0.138:9087/jeecg-boot/' // 开发环境
	// BASE_URL = 'http://10.0.8.98:9087/jeecg-boot' // 开发环境
	// BASE_URL = 'http://10.8.0.98:9087/jeecg-boot' // 开发环境
	// BASE_URL = 'http://10.8.0.138:9087/jeecg-boot' // 开发环境
	// BASE_URL = 'http://192.168.0.161:9087/jeecg-boot' // 开发环境

	// BASE_URL = 'http://10.8.0.86:8111/jeecg-boot' // 开发环境
	// BASE_URL = 'http://10.8.0.102:8098/jeecg-boot' // 开发环境
	BASE_URL = 'https://api.traiot.cn:9088/jeecg-boot' // 开发环境
} else {
	BASE_URL = 'https://api.traiot.cn:9088/jeecg-boot' // 生产环境
}

let staticDomainURL = BASE_URL + '/sys/common/static';
let unloadUrl = BASE_URL == 'https://api.traiot.cn:9088/jeecg-boot' ? "https://api.traiot.cn:9088/uploadFile": "http://10.8.0.98:8087/uploadFile";

const configService = {
	apiUrl: BASE_URL,
	unloadUrl,
	staticDomainURL: staticDomainURL
};

export default configService 