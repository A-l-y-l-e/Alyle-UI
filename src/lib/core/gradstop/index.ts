import { extractHEX, extractRGB, extractHSL, propBezInterpolate, returnRGBStr, returnHSLStr } from './utils';
import { defaultOptions } from './defaultOptions';


export function gradStop(options) {
    options = Object.assign({}, defaultOptions, options);

    if (options.stops < options.colorArray.length) {
        throw new Error('Number of stops cannot be less than colorArray.length');
    }
    return computeStops(options);
}

// computeStops
export const computeStops = options => {

    const outputArray = [];

    const init = opts => {
        switch (options.inputFormat) {
            case 'hex':
                return extractHEX(opts.colorArray);
            case 'rgb':
                return extractRGB(opts.colorArray);
            case 'hsl':
                return extractHSL(opts.colorArray);
        }
    };

    const stopsGenerator = opts => {

        const colorArray = opts.colorArray;

        const inc = 1.0 / (opts.stops - 1);

        let t = 0;

        for (let i = 0; i < opts.stops; i++) {

            if (opts.inputFormat === 'hex' || options.inputFormat === 'rgb') {
                const [r, g, b] = propBezInterpolate(['r', 'g', 'b'])(colorArray)(t);
                outputArray.push(returnRGBStr([r, g, b]));
            } else if (opts.inputFormat === 'hsl') {
                const [h, s, l] = propBezInterpolate(['h', 's', 'l'])(colorArray)(t);
                outputArray.push(returnHSLStr([h, s, l]));
            }
            t += inc;
        }
    };
    options.colorArray = init(options);
    stopsGenerator(options);

    return outputArray;
};
