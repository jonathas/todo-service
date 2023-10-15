import { AxiosHeaderValue } from 'axios';
import { HttpMethod } from '../../shared/enums';

export class HttpRequest {
  public url: string;

  public method: HttpMethod;

  public headers: { Authorization: AxiosHeaderValue };

  public data: unknown;
}
