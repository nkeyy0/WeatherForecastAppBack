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

  export const handleError = (err: ErrorHandler, res: Response) => {
    const statusCode: number = err.statusCode;
    const message: string = err.message;
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message
    })
  };