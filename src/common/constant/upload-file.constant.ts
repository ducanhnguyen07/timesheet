import { FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";

export const FileConfig = {
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
    new FileTypeValidator({
      fileType: /(image\/jpeg|image\/png|image\/jpg)/,
    }),
  ],
}

export const ExcelFileConfig = {
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
    new FileTypeValidator({
      fileType: /(application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet)/,
    }),
  ],
}


export const USER_PASSWORD_DEFAULT = '123';