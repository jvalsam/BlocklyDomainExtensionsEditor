
const modes = ['RELEASE', 'DEBUG'];

export default class Runtime {
    static getModes() {
        return modes;
    }
    static getMode () {
        return 'RELEASE';
    }
}
