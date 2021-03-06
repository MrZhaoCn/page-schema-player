import {
    getMainDomain,
    getLastLevelDomain
} from './util';

// 测试环境
// 例如: https://static.test.com/path/to/page-schema-player/index.html
var testEnvMainDomain = 'test.com';
// 测试环境子环境
// 例如: https://static-betaa.test.com/path/to/page-schema-player/index.html
var testSubEnv = ['betaa', 'betab', 'betac', 'betad'];
// 沙箱环境
// 例如: https://static-stage.test.com/path/to/page-schema-player/index.html
var stageDomainKeyword = 'stage';

/**
 * 获取默认的环境模式(自动识别)
 * 
 * @return {string}
 */
export default function getDefaultMode() {
    var mode = '';

    var hostname = window.location.hostname;
    if (hostname.replace(/[\d\.]/g, '') === '') { // 通过 IP 访问时为开发环境
        mode = 'dev';
    } else if (hostname === 'localhost') { // localhost 时为开发环境
        mode = 'dev';
    } else if (getMainDomain(hostname) === testEnvMainDomain) { // 根据域名规则来界定测试环境和沙箱环境
        mode = 'test';

        // 这里需要由使用者根据自己的情况来实现
        // 例如根据当前页面的域名, 结合测试环境域名的某些规则(例如都是 test 开头), 来自动识别为测试环境
        var lastLevelDomain = getLastLevelDomain(hostname);
        for (var i = 0, length = testSubEnv.length; i < length; i++) {
            if (lastLevelDomain.indexOf(testSubEnv[i]) !== -1) {
                mode = testSubEnv[i];
                break;
            }
        }

        if (lastLevelDomain.indexOf(stageDomainKeyword) !== -1) {
            mode = 'stage';
        }
    } else { // 默认环境模式为生产环境
        mode = 'production';
    }

    return mode;
}