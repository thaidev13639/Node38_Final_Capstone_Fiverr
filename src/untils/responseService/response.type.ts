import { Response } from 'express';
import { IResponseData, IResponseMess } from './response.dto';

const resSuccessData = (
  res: Response,
  statusCode: number,
  message: string,
  data: any,
): void => {
  let dataSuccess: IResponseData = {
    statusCode,
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
  let dataSuccess: IResponseMess = {
    statusCode,
    message,
    date: new Date(),
  };
  res.status(dataSuccess.statusCode).json(dataSuccess);
};

const resError = (res: Response, statusCode: number, message: string): void => {
  let dataError: IResponseMess = {
    statusCode,
    message,
    date: new Date(),
  };
  res.status(dataError.statusCode).json(dataError);
};

export { resSuccessData, resSuccessMess, resError };
