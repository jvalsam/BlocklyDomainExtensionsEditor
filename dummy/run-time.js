
const modes = ['RELEASE', 'DEBUG'];

export class Runtime {
    static get modes() {
        return modes;
    }
    static get mode () {
        return 'RELEASE';
    }
}