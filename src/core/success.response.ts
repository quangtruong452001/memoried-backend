import { StatusCodes, ReasonPhrases } from '../httpStatusCode/httpStatusCode';

export class SuccessResponse {
  message: string;
  status?: number;
  metadata?: object;

  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }: {
    message: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: object;
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  // send(res: any) {
  //   return res.status(this.status).json(this);
  // }
}

export class Created extends SuccessResponse {
  options?: any;

  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
    options,
  }: {
    message: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: object;
    options?: any;
  }) {
    super({
      message,
      metadata,
      statusCode,
      reasonStatusCode,
    });
    this.options = options;
  }
}
