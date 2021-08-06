import { UploadedFile } from "express-fileupload";

export default interface UploadedFileExtended extends UploadedFile {
  md5: string,
  size: number,
}