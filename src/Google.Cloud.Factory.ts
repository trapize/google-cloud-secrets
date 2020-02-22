import { IKeyManagementServiceClient, IStorageClient } from '@trapize/secrets-management';
import { KeyManagementServiceClient } from '@google-cloud/kms';
import { Storage } from '@google-cloud/storage';
import { IGoogleCloudFactory } from './IGoogle.Cloud.Factory';
import { ISecretConfig } from './ISecret.Config';

/* istanbul ignore next */
/**
 *
 *
 * @param {IAppConfig} appConfig
 * @returns {IKeyManagementServiceClient}
 */
function CreateKMS(appConfig: ISecretConfig): IKeyManagementServiceClient {
    return <IKeyManagementServiceClient><any>new KeyManagementServiceClient({
        keyFilename: appConfig.secrets.crypto.kms.account
    });
}

/* istanbul ignore next */
/**
 *
 *
 * @param {IAppConfig} appConfig
 * @returns {IStorageClient}
 */
function CreateStorage(appConfig: ISecretConfig): IStorageClient {
    return <IStorageClient><any>new Storage({
        keyFilename: appConfig.secrets.crypto.storage.account
    });
}

/* istanbul ignore next */
export const GoogleCloudFactory: IGoogleCloudFactory = {
    KMS: CreateKMS,
    Storage: CreateStorage
};