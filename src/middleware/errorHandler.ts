import {Response} from 'express';
import {ErrorHandler} from '../helpers/error'

export const handleError = (err: ErrorHandler, res: Response) => {
    const code: number = err.statusCode;
    const message: string = err.message;
    res.status(code).json({
      code,
      message
    })
  };
