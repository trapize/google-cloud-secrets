import { IKeyManagementServiceClient, IStorageClient } from '@trapize/secrets-management';
import { ISecretConfig } from './ISecret.Config';

/**
 *
 *
 * @export
 * @interface IGoogleCloudFactory
 */
export interface IGoogleCloudFactory {
    /**
     *
     *
     * @memberof IGoogleCloudFactory
     */
    KMS: (appConfig: ISecretConfig) => IKeyManagementServiceClient;
    /**
     *
     *
     * @memberof IGoogleCloudFactory
     */
    Storage: (appConfig: ISecretConfig) => IStorageClient;
};