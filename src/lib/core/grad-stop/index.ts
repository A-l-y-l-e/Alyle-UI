import { objectAssign } from './polyfill';
import { extractHEX, extractRGB, extractHSL, propBezInterpolate, returnRGBStr, returnHSLStr } from './utils';
import defaultOptions from './defaultOptions';

/**
 * GradStop
 * JavaScript micro library to generate gradient color stops
 * https://github.com/Siddharth11/gradStop.js
 */
export class GradStop {
    private _options;
    constructor(options) {
        this._options = options = objectAssign({}, this.options, options)

        if (options.stops < options.colorArray.length) {
            throw new Error('Number of stops cannot be less than colorArray.length')
        }

    }

    getColors() {
      return this.computeStops(this._options || this.options);
    }

    // GradStop deafult options
    options = defaultOptions

    // computeStops
    computeStops(options) {

        const outputArray = []

        const init = options => {
            switch (options.inputFormat) {
                case 'hex':
                    return extractHEX(options.colorArray)
                case 'rgb':
                    return extractRGB(options.colorArray)
                case 'hsl':
                    return extractHSL(options.colorArray)
            }
        }

        const stopsGenerator = options => {

            const colorArray = options.colorArray

            const inc = 1.0 / (options.stops - 1)

            let t = 0

            for (let i = 0; i < options.stops; i++) {

                if (options.inputFormat == 'hex' || options.inputFormat == 'rgb') {
                    const [r, g, b] = propBezInterpolate(['r', 'g', 'b'])(colorArray)(t)
                    outputArray.push(returnRGBStr([r, g, b]))
                } else if (options.inputFormat == 'hsl') {
                    const [h, s, l] = propBezInterpolate(['h', 's', 'l'])(colorArray)(t)
                    outputArray.push(returnHSLStr([h, s, l]))
                }
                t += inc
            }
        }
        options.colorArray = init(options)
        stopsGenerator(options)

        return outputArray
    }

    // drop 'new' keyword
    // return GradStop(options);

}
