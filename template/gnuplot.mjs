const currentScript = typeof document != 'undefined'
    ? document.currentScript
    : undefined;

const createGnuplot = (instantiateWasm) =>
    new Promise((resolve, reject) => {
        let errInfo;

        const gnuplot = (input, size) => {
            errInfo = '';
            size = size ? `size ${size.x},${size.y}` : '';

            FS.writeFile('input', input ? input : '');
            callMain(['-e', `set o "output";set t svg ${size} dynamic enhanced;`, 'input']);
            const output = FS.readFile('output', { encoding: 'utf8' });

            FS.unlink('input');
            FS.unlink('output');

            if (errInfo) throw new Error(errInfo);

            return output;
        }

        var Module = {
            'printErr': (err) => errInfo += `${err}\n`,
            'onAbort': reject,
            'onRuntimeInitialized': () => resolve(gnuplot),
            'instantiateWasm': typeof instantiateWasm === 'function' ? instantiateWasm : undefined
        };

        //{{output.js}}

    });

export default createGnuplot;
