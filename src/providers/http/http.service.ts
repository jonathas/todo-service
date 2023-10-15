import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { LoggerService } from '../logger/logger.service';
import axiosRetry from 'axios-retry';
import { ConfigService } from '@nestjs/config';
import { GeneralConfig } from '../../config/general.config';

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

  public get(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<unknown, unknown>> {
    this.logger.debug(`Get request to url: ${url}`);
    return axios.get(url, this.populateConfig(config));
  }

  public post(
    url: string,
    data: unknown,
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<unknown, unknown>> {
    this.logger.debug(`Post request to url: ${url}`);
    return axios.post(url, data, this.populateConfig(config));
  }

  public put(
    url: string,
    data: unknown,
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<unknown, unknown>> {
    this.logger.debug(`Put request to url: ${url}`);
    return axios.put(url, data, this.populateConfig(config));
  }

  public patch(
    url: string,
    data: unknown,
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<unknown, unknown>> {
    this.logger.debug(`Patch request to url: ${url}`);
    return axios.patch(url, data, this.populateConfig(config));
  }

  public delete(url: string, config: AxiosRequestConfig): Promise<AxiosResponse<unknown, unknown>> {
    this.logger.debug(`Put request to url: ${url}`);
    return axios.delete(url, { ...this.populateConfig(config) });
  }

  private populateConfig(config: AxiosRequestConfig) {
    return { ...this.getDefaultConfig(), ...config };
  }

  private getDefaultConfig(): AxiosRequestConfig {
    return {
      maxRedirects: 5,
      timeout: 100000
    };
  }
}
