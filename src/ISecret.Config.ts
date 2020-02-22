import { IAppConfig } from '@trapize/core';
import { ISecretAppSettings } from '@trapize/secrets-management';

export interface ISecretConfig extends IAppConfig {
    secrets: ISecretAppSettings;
}