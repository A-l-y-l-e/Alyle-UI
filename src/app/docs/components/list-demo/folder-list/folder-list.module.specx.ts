import { FolderListModule } from './folder-list.module';

describe('FolderListModule', () => {
  let folderListModule: FolderListModule;

  beforeEach(() => {
    folderListModule = new FolderListModule();
  });

  it('should create an instance', () => {
    expect(folderListModule).toBeTruthy();
  });
});
