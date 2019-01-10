import { Component, ChangeDetectionStrategy, Renderer2, ElementRef, OnInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { LyTheme2, Platform } from '@alyle/ui';

const styles = ({
  root: {
    display: 'block'
  },
  intraContainer: {
    textAlign: 'center',
    color: '#fff',
    height: 'calc(100vh - 96px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  intraContent: {
    position: 'relative',
    '& a': {
      margin: '8px'
    },
    '& > p': {
      fontWeight: 300,
    },
    '& > h1': {
      fontFamily: `'Nunito', sans-serif`,
      letterSpacing: '-.04em',
      textShadow: 'rgba(255, 255, 255, 0.4) 0px 0px 11px'
    }
  },
  buttons: {
    display: 'inline-flex',
    paddingTop: '1em'
  },
  container: {
    paddingAbove: '1.5em',
    textAlign: 'center',
  },
  gridContainer: {
    position: 'relative',
    textAlign: 'center',
    marginTop: '1em',
    marginBottom: '1em',
    'ly-grid': {
      h2: {
        fontFamily: `'Nunito', sans-serif`,
        marginBelow: '.5em'
      },
      p: {
        opacity: .87
      }
    }
  },
  canvas: {
    backgroundColor: '#1a0e2d',
    width: '100%',
    height: '100vh',
    position: 'absolute',
    left: 0,
    top: 0,
    pointerEvents: 'none'
  }
});

@Component({
  selector: 'aui-home',
  templateUrl: './home.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly classes = this.theme.addStyleSheet(styles);
  private intra: Intra;

  @HostListener('window:resize') _resize$() {
    if (this.intra) {
      this.ngZone.runOutsideAngular(() => {
        this.intra.onWindowResize();
      });
    }
  }

  constructor(
    renderer: Renderer2,
    el: ElementRef,
    private theme: LyTheme2,
    private ngZone: NgZone
  ) {
    renderer.addClass(el.nativeElement, this.classes.root);
  }

  ngOnInit() {
    if (Platform.isBrowser) {
      this.theme.requestAnimationFrame(() => {
        this.intra = new Intra('#1a0e2d', 700, 17, 3000, 0.000009, 9000);
        this.intra.start();
      });
    }
  }

  ngOnDestroy() {
    if (Platform.isBrowser) {
      if (this.intra) {
        this.intra.stop();
      }
    }
  }
}

declare var SimplexNoise: { new(): { noise3D: (arg0: number, arg1: number, arg2: number) => number; }; new(): { noise3D: (arg0: number, arg1: number, arg2: number) => number; }; };

// const Config = {
//   backgroundColor: '#030722',
//   particleNum: 700,
//   step: 17,
//   base: 3000,
//   zInc: 0.000009
// };

export class Intra {
  private fadeTime = 2000; // in ms
  private fadeTimeStart: number;

  private canvas: HTMLCanvasElement;
  private screenWidth: number;
  private screenHeight: number;
  private centerX: number;
  private centerY: number;
  private particles: Particle[] = [];
  private hueBase = 0;
  private simplexNoise: { noise3D: (arg0: number, arg1: number, arg2: number) => number; };
  private zoff = 0;
  private can2: HTMLCanvasElement;
  private ctx2: CanvasRenderingContext2D;
  private ctx: CanvasRenderingContext2D;
  private requestId?: number;
  private timeoutId: any;

  // Initialize

  constructor(
    private backgroundColor: string,
    private particleNum: number,
    private step: number,
    private base: number,
    private zInc: number,
    private duration: number
    ) { }

  start() {
    this.stop();
    this.timeoutId = setTimeout(() => {
      this.stop();
    }, this.duration);
    this.canvas = document.getElementById('bg') as HTMLCanvasElement;
    this.can2 =  document.createElement('canvas');
    this.ctx = this.can2.getContext('2d')!;
    this.ctx2 = this.canvas.getContext('2d')!;

    this.updatePosition();

    for (let i = 0, len = this.particleNum; i < len; i++) {
      this.particles[i] = new Particle();
      this.initParticle(this.particles[i]);
    }

    // canvas.addEventListener('click', onCanvasClick, true);
    this.simplexNoise = new SimplexNoise();

    this.requestId = requestAnimationFrame(this.update.bind(this));
    this.ctx.lineWidth = 0.7;
    this.ctx.lineCap = this.ctx.lineJoin = 'round';
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
  }


  // Event listeners

  onWindowResize() {
    this.updatePosition();
    this.stop();
    this.start();
  }

  private updatePosition() {
    this.can2.width = this.screenWidth  = this.canvas.width  = window.innerWidth;
    this.can2.height = this.screenHeight = this.canvas.height = window.innerHeight;
    this.centerX = this.screenWidth / 10;
    this.centerY = this.screenHeight / 10;
  }

  // onCanvasClick(e: any) {
  //   this.ctx.globalAlpha = 0.9;
  //   this.ctx.fillStyle = this.backgroundColor;
  //   this.ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);

  //   this.simplexNoise = new SimplexNoise();
  //   this.fadeTimeStart = undefined;
  // }


  // Functions

  getNoise(x: number, y: number, z: number) {
    const octaves = 2;
    const fallout = 0.5;
    let amp = 1, f = 1, sum = 1;

    for (let i = 0; i < octaves; ++i) {
        amp *= fallout;
        sum += amp * (this.simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 4.4;
        f *= 3;
    }

    return sum;
  }

  initParticle(p: Particle) {
    p.x = p.pastX = this.screenWidth * Math.random();
    p.y = p.pastY = this.screenHeight * Math.random();
    p.color.h = this.hueBase + Math.atan2(this.centerY - p.y, this.centerX - p.x) * 200 / Math.PI;
    p.color.s = 1;
    p.color.l = 0.6;
    p.color.a = 0;
  }


  // Update

  update(time: number) {
    const step = this.step;
    const base = this.base;
    let i: number, p: Particle, angle: number;

    for (i = 0; i < this.particles.length; i++) {
        p = this.particles[i];

        p.pastX = p.x;
        p.pastY = p.y;

        angle = Math.PI * 6 * this.getNoise(p.x / base * 1.75, p.y / base * 1.75, this.zoff);
        p.x += Math.cos(angle) * step;
        p.y += Math.sin(angle) * step;

        if (p.color.a < 1) { p.color.a += 0.001; }

        this.ctx.beginPath();
        this.ctx.strokeStyle = p.color.toString();
        this.ctx.moveTo(p.pastX, p.pastY);
        this.ctx.lineTo(p.x, p.y);
        this.ctx.stroke();

        if (p.x < 0 || p.x > this.screenWidth || p.y < 0 || p.y > this.screenHeight) {
            this.initParticle(p);
        }
    }

    this.hueBase += 0.4;
    this.zoff += this.zInc;

    // Code to fade in the view
    if (this.fadeTimeStart === undefined) {
        this.fadeTimeStart = time;
    }
    const fTime = (time - this.fadeTimeStart) / this.fadeTime;
    if (fTime < 1) {
        this.ctx2.globalAlpha = fTime;
        this.ctx2.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx2.drawImage(this.can2, 0, 0);
    } else {
        this.ctx2.globalAlpha = 1;
        this.ctx2.drawImage(this.can2, 0, 0);
    }

    this.requestId = requestAnimationFrame(this.update.bind(this));
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
    }
  }
}


/**
* HSLA
*/
class HSLA {
  constructor(public h = 0, public s = 0, public l = 0, public a = 0) { }
  toString() {
    return 'hsla(' + this.h + ',' + (this.s * 100) + '%,' + (this.l * 100) + '%,' + this.a + ')';
  }
}


/**
* Particle
*/
class Particle {
  x: number;
  y: number;
  color: HSLA;
  pastX = this.x;
  pastY = this.y;
  constructor(x?: number, y?: number, color?: { h: number; s: number; l: number; a: number; }) {
    this.x = x || 0;
    this.y = y || 0;
    this.color = color || new HSLA();
  }
}
