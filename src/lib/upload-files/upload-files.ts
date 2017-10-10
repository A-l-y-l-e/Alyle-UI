import {
  Component,
  ElementRef,
  forwardRef,
  NgModule,
  Input,
  Output,
  Directive,
  SimpleChange,
  OnChanges,
  ModuleWithProviders
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
export const LY_UPLOAD_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LyUploadFiles),
  multi: true
};
@Component({
  // moduleId: module.id.toString(),
  selector: 'ly-files-select',
  styleUrls: ['upload-files.css'],
  template: `
  <div class="_container-files">
    <div class="_item-file" *ngFor="let file of files; let i = index">
      <div class="_file-inf">
        <div class="_file-name">{{file.file.name}}</div>
        <div class="_file-size">{{round(file.file.size / 1024)}} Kb</div>
      </div>
      <div [style.background]="file.color" class="_file-type" [ngStyle]="_itemFileStyles">
        <div [class]="file.file.type">{{file.file.type}}</div>
      </div>
      <div class="_file-img">
        <img *ngIf="file.file.type == 'image/jpeg' ||
        file.file.type == 'image/jpg' ||
        file.file.type == 'image/png' ||
        file.file.type == 'image/gif'"
        [src]="_null" class="_file-img"
        [style.background-image]="'url(' + file.data.target.result + ')'" />
      </div>
      <div class="_file-remove" (click)="removeFile(i)">x</div>
    </div>
    <span class="_total-file-size">{{ files.length }} Files Selected</span>
  </div>
  `,
  providers: [LY_UPLOAD_CONTROL_VALUE_ACCESSOR],
})
export class LyUploadFiles {
  files: Array<any> = [];
  _null = `data:image/png;base64,iVBORw0KG${
    'goAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAI'
  }AAAUAAarVyFEAAAAASUVORK5CYII=`;
  constructor(
    private elementRef: ElementRef,
  ) {

  }
  round(val: number) {
    return Math.round(val);
  }
  removeFile(index: number) {
    this.files = this.files.filter((_, i) => i !== index);
    // console.log(index);
  }
  get _itemFileStyles() {
    return {
      color: 'red',
    };
  }

  ngOnChanges(changes: {[key: string]: SimpleChange}) {
  }


  changeInput($event: any) {
    let files = $event.target.files;
    let fileName = $event.target.value.replace(/.*(\/|\\)/, '');
    let fileReader = new FileReader();
    let blank = `data:image/png;base64,iVBORw0KGgoAAAANSUhEU${
      'gAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAA'
    }IAAAUAAarVyFEAAAAASUVORK5CYII=`;

    console.log('length', $event.target.files.length);
    for (var _i = 0; _i < $event.target.files.length; _i++) {
      console.log(_i);
      // fileReader.readAsDataURL($event.target.files[_i]);
      let _fileReader = new FileReader();
      _fileReader.onload = (ev: any) => {
        // console.log('ev', ev);
        console.log('$event', $event, _i);
        // console.log(md5$($event.target.files[_i].type));
        if ($event.target.files[_i].type === 'image/jpeg' ||
        $event.target.files[_i].type === 'image/jpg' ||
        $event.target.files[_i].type === 'image/png' ||
        $event.target.files[_i].type === 'image/gif' ) {
          // console.log('is file IMAGE');
          // this.imgDataUrl = ev.target.result;
        } else {
          // console.log('not image');
        }
        let color = 'abced235356';
        // let color = md5$($event.target.files[_i].type);
        this.files.push({
          file: $event.target.files[_i],
          data: ev,
          color: '#ff' + color.substr(0, 4),
        });
      };
      _fileReader.readAsDataURL($event.target.files[_i]);
      // console.log('_i', _i, $event.target.files[_i]);
    }
    // console.warn('this.files', this.files);
  }

}


@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [LyUploadFiles],
  declarations: [LyUploadFiles],
})
export class LyUploadFilesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LyUploadFilesModule,
      providers: []
    };
  }
}
