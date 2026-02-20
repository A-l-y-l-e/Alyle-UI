import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { LyCommonModule, lyl, LyTheme2, StyleRenderer, ThemeRef, ThemeVariables } from '@alyle/ui';
import { Platform } from '@angular/cdk/platform';
import { RouterLink } from '@angular/router';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyGridModule } from '@alyle/ui/grid';
import { LyButtonModule } from '@alyle/ui/button';
const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
  const __ = ref.selectorsOf(STYLES);
  return {
    root: lyl `{
      display: block
    }`,
    intraContainer: lyl `{
      text-align: center
      color: #fff
      margin-top: -32px
      height: calc(100vh - 64px)
      min-height: 336px
      display: flex
      justify-content: center
      align-items: center
    }`,
    intraContent: () => lyl `{
      position: relative
      & ${__.buttons} a {
        margin: 8px
      }
      & > p {
        font-weight: 300
      }
      & > h1 {
        font-family: 'Nunito', sans-serif
        letter-spacing: -.04em
        text-shadow: rgba(255, 255, 255, 0.4) 0px 0px 11px
      }
    }`,
    buttons: lyl `{
      display: inline-flex
      padding-top: 1em
    }`,
    container: lyl `{
      padding-top: 1.5em
      text-align: center
    }`,
    gridContainer: lyl `{
      position: relative
      text-align: center
      margin-top: 1em
      margin-bottom: 1em
      ly-grid {
        h2 {
          margin-bottom: .5em
        }
        p {
          opacity: .87
        }
      }
    }`,
    canvas: lyl `{
      background-color: #1a0e2d
      width: 100%
      height: 100vh
      min-height: 400px
      position: absolute
      left: 0
      top: 0
      pointer-events: none
    }`
  };
};

@Component({
  selector: 'aui-home',
  templateUrl: './home.component.html',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    StyleRenderer
  ],
  standalone: true,
  imports: [
    LyButtonModule,
    RouterLink,
    LyTypographyModule,
    LyGridModule,
    LyCommonModule
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly classes = this.sRenderer.renderSheet(STYLES, 'root');
  private intra: Intra;

  @HostListener('window:resize') _resize$() {
    if (this.intra) {
      this.ngZone.runOutsideAngular(() => {
        this.intra.onWindowResize();
      });
    }
  }

  constructor(
    readonly sRenderer: StyleRenderer,
    private theme: LyTheme2,
    private ngZone: NgZone,
    private _platform: Platform
  ) { }

  ngOnInit() {
    if (this._platform.isBrowser) {
      this.theme.requestAnimationFrame(() => {
        this.intra = new Intra('#1a0e2d', 700, 17, 3000, 0.000009, 9000);
        this.intra.start();
      });
    }
  }

  ngOnDestroy() {
    if (this._platform.isBrowser) {
      if (this.intra) {
        this.intra.stop();
      }
    }
  }
}
declare var SimplexNoise: {
  new(): {
    noise3D: (arg0: number, arg1: number, arg2: number) => number;
  };
};
declare var SimplexNoise: {
  new(): {
    noise3D: (arg0: number, arg1: number, arg2: number) => number;
  };
};

export class Intra {
  // Constantes de animación (valores originales)
  private readonly FADE_TIME = 2000;
  private readonly OCTAVES = 2;
  private readonly FALLOUT = 0.5;
  private readonly LINE_WIDTH = 0.7;
  private readonly HUE_INCREMENT = 0.4;
  private readonly ALPHA_INCREMENT = 0.001;

  // Estado de la animación
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
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private ctx: CanvasRenderingContext2D;
  private requestId?: number;
  private timeoutId?: number;
  private isRunning = false;

  constructor(
    private readonly backgroundColor: string,
    private readonly particleNum: number,
    private readonly step: number,
    private readonly base: number,
    private readonly zInc: number,
    private readonly duration: number
  ) {}

  start() {
    // Evitar múltiples instancias
    if (this.isRunning) {
      return;
    }

    this.stop();
    this.isRunning = true;

    // Configurar timeout para detener la animación
    this.timeoutId = window.setTimeout(() => {
      this.stop();
    }, this.duration);

    // Inicializar canvas principal
    this.canvas = document.getElementById('bg') as HTMLCanvasElement;
    if (!this.canvas) {
      console.error('Canvas element with id "bg" not found');
      return;
    }

    // Crear canvas offscreen para mejor rendimiento
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d', {
      alpha: false
    })!;
    this.ctx = this.canvas.getContext('2d', {
      alpha: false
    })!;

    // Configurar dimensiones
    this.updateDimensions();

    // Inicializar partículas
    this.particles = [];
    for (let i = 0; i < this.particleNum; i++) {
      const particle = new Particle();
      this.initParticle(particle);
      this.particles.push(particle);
    }

    // Inicializar generador de ruido Simplex
    this.simplexNoise = new SimplexNoise();

    // Configurar estilo de dibujo
    this.offscreenCtx.lineWidth = this.LINE_WIDTH;
    this.offscreenCtx.lineCap = 'round';
    this.offscreenCtx.lineJoin = 'round';
    this.offscreenCtx.fillStyle = this.backgroundColor;
    this.offscreenCtx.fillRect(0, 0, this.screenWidth, this.screenHeight);

    // Iniciar animación
    this.requestId = requestAnimationFrame(this.update.bind(this));
  }

  onWindowResize() {
    if (!this.isRunning) {
      return;
    }
    this.updateDimensions();
    this.stop();
    this.start();
  }

  private updateDimensions() {
    this.screenWidth = this.canvas.width = this.offscreenCanvas.width = window.innerWidth;
    this.screenHeight = this.canvas.height = this.offscreenCanvas.height = window.innerHeight;
    
    // Mantener cálculo original del centro (dividido por 10)
    this.centerX = this.screenWidth / 10;
    this.centerY = this.screenHeight / 10;
  }

  private getNoise(x: number, y: number, z: number): number {
    let amp = 1;
    let f = 1;
    let sum = 1;

    for (let i = 0; i < this.OCTAVES; i++) {
      amp *= this.FALLOUT;
      sum += amp * (this.simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 4.4;
      f *= 3;
    }

    return sum;
  }

  private initParticle(p: Particle) {
    p.x = p.pastX = this.screenWidth * Math.random();
    p.y = p.pastY = this.screenHeight * Math.random();
    p.color.h = this.hueBase + Math.atan2(this.centerY - p.y, this.centerX - p.x) * 200 / Math.PI;
    p.color.s = 1;
    p.color.l = 0.6;
    p.color.a = 0;
  }

  private update(time: number) {
    if (!this.isRunning) {
      return;
    }

    // Actualizar cada partícula
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Guardar posición anterior
      p.pastX = p.x;
      p.pastY = p.y;

      // Calcular nuevo ángulo basado en campo de ruido
      const angle = Math.PI * 6 * this.getNoise(
        p.x / this.base * 1.75,
        p.y / this.base * 1.75,
        this.zoff
      );

      // Actualizar posición
      p.x += Math.cos(angle) * this.step;
      p.y += Math.sin(angle) * this.step;

      // Incrementar alpha gradualmente
      if (p.color.a < 1) {
        p.color.a += this.ALPHA_INCREMENT;
      }

      // Dibujar línea desde posición anterior a nueva posición
      this.offscreenCtx.beginPath();
      this.offscreenCtx.strokeStyle = p.color.toString();
      this.offscreenCtx.moveTo(p.pastX, p.pastY);
      this.offscreenCtx.lineTo(p.x, p.y);
      this.offscreenCtx.stroke();

      // Reiniciar partícula si sale de la pantalla
      if (
        p.x < 0 ||
        p.x > this.screenWidth ||
        p.y < 0 ||
        p.y > this.screenHeight
      ) {
        this.initParticle(p);
      }
    }

    // Actualizar base de color y offset z
    this.hueBase += this.HUE_INCREMENT;
    this.zoff += this.zInc;

    // Efecto fade-in inicial
    if (this.fadeTimeStart === undefined) {
      this.fadeTimeStart = time;
    }

    const fadeProgress = (time - this.fadeTimeStart) / this.FADE_TIME;

    if (fadeProgress < 1) {
      this.ctx.globalAlpha = fadeProgress;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    } else {
      this.ctx.globalAlpha = 1;
      this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    }

    // Continuar animación
    this.requestId = requestAnimationFrame(this.update.bind(this));
  }

  stop() {
    this.isRunning = false;

    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    if (this.requestId !== undefined) {
      cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
    }
  }

  // Getter para verificar el estado
  getIsRunning(): boolean {
    return this.isRunning;
  }
}

/**
 * HSLA Color representation
 */
class HSLA {
  constructor(
    public h = 0,
    public s = 0,
    public l = 0,
    public a = 0
  ) {}

  toString(): string {
    return `hsla(${this.h},${this.s * 100}%,${this.l * 100}%,${this.a})`;
  }
}

/**
 * Particle representation
 */
class Particle {
  x: number;
  y: number;
  color: HSLA;
  pastX: number;
  pastY: number;

  constructor(x = 0, y = 0, color?: HSLA) {
    this.x = x;
    this.y = y;
    this.color = color || new HSLA();
    this.pastX = x;
    this.pastY = y;
  }
}