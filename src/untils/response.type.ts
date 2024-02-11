import { Response } from 'express';

const resSuccess200Data = (res: Response, message: string, data: any): void => {
  let dataSuccess = {
    statusCode: 200,
    message,
    content: data,
    date: new Date(),
  };
  res.status(dataSuccess.statusCode).json(dataSuccess);
};

const resSuccessMess = (
  res: Response,
  statusCode: number,
  message: string,
): void => {
  let dataSuccess = {
    statusCode,
    message,
    date: new Date(),
  };
  res.status(dataSuccess.statusCode).json(dataSuccess);
};

const resError = (res: Response, statusCode: number, message: string): void => {
  let dataError = {
    statusCode,
    message,
    date: new Date(),
  };
  res.status(dataError.statusCode).json(dataError);
};

export { resSuccess200Data, resSuccessMess, resError };
