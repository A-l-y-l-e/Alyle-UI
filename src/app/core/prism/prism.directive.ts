import { Component, ElementRef, Input, OnInit, Renderer2, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Platform, LyTheme2 } from '@alyle/ui';
import { PrismService } from './prism.service';

import * as _chroma from 'chroma-js';
import { AUIThemeVariables } from '../../app.module';
import { DOCUMENT } from '@angular/common';
const chroma = _chroma;

const Prism = require('prismjs');
Prism.languages.typescript = Prism.languages.extend('javascript', {
  // tslint:disable-next-line:max-line-length
  keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,
  builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
});
Prism.languages.ts = Prism.languages.typescript;

require('prismjs/components/prism-markdown');
require('prismjs/components/prism-json');
Prism.hooks.add('wrap', function(env) {
  if (env.type === 'string') {
    const VALUE = env.content.slice(1).slice(0, -1);
    if (
      /(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}|(?:rgba?|hsla?)\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s\/]*[\d\.]+%?\))/i.test(env.content) || VALUE in chroma['colors']) {
      try {
        const chromaColor = chroma(VALUE);
        const luminance = chromaColor.luminance();
        env.attributes.style = `background:${VALUE};color:${luminance < 0.5 ? 'white' : '#202020'};opacity:${chromaColor.alpha()}`;
      } catch (error) { }
    }
    env.content = `<span>${env.content}</span>`;
  }
});

const GLOBAL_STYLES = {
  '@global': {
    'prism': {
      display: 'block',
      padding: '1em',
      overflow: 'auto'
    }
  }
};

const STYLES = (theme: AUIThemeVariables) => ({
  root: {
    color: theme.codeColor,
    backgroundColor: theme.codeBg,
    direction: 'ltr',
    'pre[class*="language-"]': {
      padding: '1em',
      margin: '.5em 0',
      overflow: 'auto',
    },
    '& code[class*="language-"], & pre[class*="language-"]': {
      background: 'none',
      fontFamily: `'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
      textAlign: 'left',
      fontSize: '0.8125em',
      fontWeight: 500,
      whiteSpace: 'pre',
      wordSpacing: 'normal',
      wordBreak: 'break-word',
      wordWrap: 'normal',
      lineHeight: 1.5,
      '-moz-tab-size': 4,
      '-o-tab-size': 4,
      tabSize: 4,
      '-webkit-hyphens': 'none',
      '-moz-hyphens': 'none',
      '-ms-hyphens': 'none',
      hyphens: 'none',
    }
  }
});


const PRISM_STYLES = (theme: AUIThemeVariables) => {
  return {
    token: {
      color: theme.prism.colorText,
      '&{keyword}, &{selector-tag}, &{title}, &{section}, &{doctag}, &{name}, &{strong}': {
        color: theme.prism.keyword,
        fontWeight: '600'
      },
      '&{comment}': {
        color: 'rgba(115, 129, 145, 0.65)'
      },
      '&{string}, &{title}, &{section}, &{built_in}, &{literal}, &{type}, &{addition}, &{tag}, &{quote}, &{name}, &{selector-id}, &{selector-class}': {
        color: theme.prism.keyword
      },
      '&{meta}, &{subst}, &{symbol}, &{regexp}, &{attribute}, &{deletion}, &{variable}, &{template-variable}, &{link}, &{bullet}': {
        color: '#4c81c9'
      },
      '&{emphasis}': {
        fontStyle: 'italic'
      },
      '&{function}': {
        color: '#4584ff'
      },
      '&{attr-name}': {
        color: '#FFB62C'
      },
      '&{attr-value}': {
        color: theme.prism.keyword
      },
      '&{string}': {
        color: theme.prism.string
      },
      '&{number}': {
        color: 'rgb(36, 212, 158)'
      },
      '&{punctuation}, &{operator}': {
        color: '#9786c5'
      },
      '&{class-name}': {
        color: chroma(theme.accent.default).alpha(.88).css()
      },
      '&{constant}': {
        color: '#EF5350'
      },
      '&{builtin}': {
        color: '#8796b0'
      }
    },
    keyword: null,
    'selector-tag': null,
    title: null,
    section: null,
    doctag: null,
    name: null,
    strong: null,
    comment: null,
    string: null,
    built_in: null,
    literal: null,
    type: null,
    addition: null,
    tag: null,
    quote: null,
    'selector-id': null,
    'selector-class': null,
    meta: null,
    subst: null,
    symbol: null,
    regexp: null,
    attribute: null,
    deletion: null,
    variable: null,
    'template-variable': null,
    link: null,
    bullet: null,
    emphasis: null,
    function: null,
    punctuation: null,
    number: null,
    operator: null,
    constant: null,
    'attr-value': null,
    'attr-name': null,
    'class-name': null,
    builtin: null,
    property: null
  };
};

const NOP_STYLES = {};

@Component({
  selector: '[prism], prism',
  template: `<code class="language-">{{ code }}</code>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrismDirective implements OnInit {
  classes = this.theme.addStyleSheet(STYLES, -2);
  prismClasses = Platform.isBrowser ? this.theme.addStyleSheet(PRISM_STYLES, -2) : NOP_STYLES;
  private _code: string;
  @Input() language = 'ts';
  @Input()
  set code(val) {
    this._code = val;
    this.codeToHtml(val);
  }
  get code() { return this._code; }

  constructor(
    private theme: LyTheme2,
    private _elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private _document: any,
    _prismService: PrismService
  ) {
    theme.addStyleSheet(GLOBAL_STYLES);
    _prismService.setCustomClass(this.prismClasses);
  }

  ngOnInit() {
    this.renderer.addClass(this._elementRef.nativeElement, this.classes.root);
  }
  codeToHtml(val: string) {
    if (Platform.isBrowser) {
      let code: string;
      const containerCode = this._document.createElement('code');
      if (this.language === 'ts') {
        this.renderer.addClass(containerCode, 'language-typescript');
        code = Prism.highlight(`${val}`, Prism.languages.javascript);
      } else {
        this.renderer.addClass(containerCode, `language-${this.language}`);
        code = Prism.highlight(`${val}`, Prism.languages[this.language]);
      }
      containerCode.innerHTML = code;
      this._elementRef.nativeElement.innerHTML = '';
      this.renderer.appendChild(this._elementRef.nativeElement, containerCode);
    }
  }

}

// tslint:disable-next-line:no-shadowed-variable
(function(Prism) {
  const insideString = {
    variable: [
      // Arithmetic Environment
      {
        pattern: /\$?\(\([\s\S]+?\)\)/,
        inside: {
          // If there is a $ sign at the beginning highlight $(( and )) as variable
          variable: [{
              pattern: /(^\$\(\([\s\S]+)\)\)/,
              lookbehind: true
            },
            /^\$\(\(/
          ],
          number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
          // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
          operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
          // If there is no $ sign at the beginning highlight (( and )) as punctuation
          punctuation: /\(\(?|\)\)?|,|;/
        }
      },
      // Command Substitution
      {
        pattern: /\$\([^)]+\)|`[^`]+`/,
        greedy: true,
        inside: {
          variable: /^\$\(|^`|\)$|`$/
        }
      },
      /\$(?:[\w#?*!@]+|\{[^}]+\})/i
    ]
  };

  Prism.languages.bash = {
    'shebang': {
      pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
      alias: 'important'
    },
    'comment': {
      pattern: /(^|[^"{\\])#.*/,
      lookbehind: true
    },
    'string': [
      // Support for Here-Documents https://en.wikipedia.org/wiki/Here_document
      {
        pattern: /((?:^|[^<])<<\s*)["']?(\w+?)["']?\s*\r?\n(?:[\s\S])*?\r?\n\2/,
        lookbehind: true,
        greedy: true,
        inside: insideString
      },
      {
        pattern: /(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\1)[^\\])*\1/,
        greedy: true,
        inside: insideString
      }
    ],
    'variable': insideString.variable,
    // Originally based on http://ss64.com/bash/
    'function': {
      // tslint:disable-next-line:max-line-length
      pattern: /(^|[\s;|&])(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|npm|yarn|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|[\s;|&])/,
      lookbehind: true
    },
    'keyword': {
      pattern: /(^|[\s;|&])(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|[\s;|&])/,
      lookbehind: true
    },
    'boolean': {
      pattern: /(^|[\s;|&])(?:true|false)(?=$|[\s;|&])/,
      lookbehind: true
    },
    'operator': /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
    'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
  };

  const inside = (insideString.variable[1] as any).inside;
  inside.string = Prism.languages.bash.string;
  inside['function'] = Prism.languages.bash['function'];
  inside.keyword = Prism.languages.bash.keyword;
  inside['boolean'] = Prism.languages.bash['boolean'];
  inside.operator = Prism.languages.bash.operator;
  inside.punctuation = Prism.languages.bash.punctuation;

  Prism.languages.shell = Prism.languages.bash;
})(Prism);
