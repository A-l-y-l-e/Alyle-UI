import { enableProdMode } from '@angular/core';

import { environment } from '@env/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from 'app/app.server.module';
