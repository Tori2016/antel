import { HttpException, HttpStatus } from '@nestjs/common';

export class HandleError extends Error {
  constructor({
    type,
    message,
  }: {
    type: keyof typeof HttpStatus;
    message: string;
  }) {
    super(`${type} :: ${message}`);
  }

  public static createSignatureError(message: string) {
    const name = message.split(' :: ')[0];
    const error = message.split(' :: ')[1];

    const dbError = message.split('-')[0];
    const dbMsg = message.split('-')[1];

    if (dbError === '11000') {
      throw new HttpException(
        `FIELD_EXISTS :: ${dbMsg}`,
        HttpStatus['BAD_REQUEST'],
      );
    } else if (name) {
      throw new HttpException(error, HttpStatus[name]);
    } else {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
