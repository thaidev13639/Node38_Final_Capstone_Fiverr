class IResponseData {
  statusCode: number;
  message: string;
  content: any;
  date: Date;
}
class IResponseMess {
  statusCode: number;
  message: string;
  date: Date;
}

export { IResponseData, IResponseMess };
