import { Injectable } from '@nestjs/common';

type CookieSetupBase = {
  httpOnly: boolean;
  domain: string;
  path: string;
};

type ProductionCookieSetup = CookieSetupBase & {
  sameSite: 'strict' | 'lax' | 'none';
  secure: boolean;
};

type DevelopmentCookieSetup = CookieSetupBase;

export type CookieSetup<T extends 'production' | 'development'> =
  T extends 'production' ? ProductionCookieSetup : DevelopmentCookieSetup;

@Injectable()
export class ConfigService {
  private origins: string;
  private domains: string;
  private mode: 'production' | 'development'; // Изменим тип на конкретные значения

  constructor() {
    this.origins = process.env.ORIGINS || '';
    this.domains = process.env.DOMAINS || '';
    this.mode = (process.env.MODE || 'development') as
      | 'production'
      | 'development';
  }

  public getOrigins(): string[] {
    return this.origins
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
  }

  public getDomain(): string {
    if (this.mode === 'production') {
      return this.domains.split(',')[1]?.trim() || '';
    } else {
      return this.domains.split(',')[0]?.trim() || '';
    }
  }

  public getMode(): 'production' | 'development' {
    return this.mode;
  }

  public getCookieSetup(): CookieSetup<'production' | 'development'> {
    if (this.mode === 'production') {
      return {
        httpOnly: true,
        domain: this.getDomain(),
        path: '/',
        sameSite: 'strict',
        secure: true,
      } as CookieSetup<'production'>;
    } else {
      return {
        httpOnly: true,
        domain: this.getDomain(),
        path: '/',
      } as CookieSetup<'development'>;
    }
  }
}
