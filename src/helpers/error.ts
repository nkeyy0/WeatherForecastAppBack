import {Response} from 'express';

export class ErrorHandler extends Error {
    statusCode: number;
    message: string;
    constructor(statusCode: number, message: string) {
      super();
      this.statusCode = statusCode;
      this.message = message;
    }
  }
