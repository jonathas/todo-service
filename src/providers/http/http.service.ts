import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { LoggerService } from '../logger/logger.service';
import axiosRetry from 'axios-retry';
import { ConfigService } from '@nestjs/config';
import { GeneralConfig } from '../../config/general.config';
import { HttpRequest } from './http.types';

@Injectable()
export class HttpService {
  public constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(HttpService.name);
    axiosRetry(axios, {
      retryDelay: () => this.config.get<GeneralConfig>('general').httpRetriesDelay,
      retries: this.config.get<GeneralConfig>('general').httpRetriesCount,
      onRetry: (retryCount, error, requestConfig) => {
        this.logger.error(
          `Failed to make http request to ${requestConfig.url} retrying - ${retryCount} time`
        );
      }
    });
  }

  public request(req: HttpRequest): Promise<AxiosResponse<unknown, unknown>> {
    const { url, method, headers, data } = req;
    this.logger.debug(`Request to url: ${url}`);

    return axios.request({
      url,
      method,
      headers,
      data,
      maxRedirects: 5,
      timeout: 100000
    });
  }
}
