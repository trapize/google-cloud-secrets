import { injectable, inject, optional } from 'inversify';
import { ISecretService, ISecretAppSettings, IKeyManagementServiceClient, IStorageClient, Secrets } from '@trapize/secrets-management';
import { Core } from '@trapize/core';
import Path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { IGoogleCloudFactory } from './IGoogle.Cloud.Factory';
import { ISecretConfig } from './ISecret.Config';
import { GoogleCloudSecretSymbols } from './Secrets.Symbols';

/**
 *
 *
 * @export
 * @class SecretService
 * @implements {ISecretService}
 */
@injectable()
export class SecretService implements ISecretService {
    /**
     *
     *
     * @private
     * @type {IKeyManagementServiceClient}
     * @memberof SecretService
     */
    private kmsClient: IKeyManagementServiceClient;
    /**
     *
     *
     * @private
     * @type {IStorageClient}
     * @memberof SecretService
     */
    private storageClient: IStorageClient;
    
    /**
     *Creates an instance of SecretService.
     * @param {IAppConfig} appConfig
     * @param {IGoogleCloudFactory} factory
     * @param {IKeyManagementServiceClient} [kmsClient]
     * @param {IStorageClient} [storageClient]
     * @memberof SecretService
     */
    public constructor(
        @inject(Core.Configuration.IAppConfig) private appConfig: ISecretConfig,
        @inject(GoogleCloudSecretSymbols.IGoogleCloudFactory) factory: IGoogleCloudFactory,
        @inject(Secrets.KmsClient) @optional() kmsClient?: IKeyManagementServiceClient,
        @inject(Secrets.KmsStorage) @optional() storageClient?: IStorageClient,
    ) {
        this.kmsClient = kmsClient ? kmsClient : factory.KMS(this.appConfig);
        this.storageClient = storageClient ? storageClient : factory.Storage(this.appConfig);
    }
    
    /**
     *
     *
     * @readonly
     * @private
     * @type {ISecretAppSettings}
     * @memberof SecretService
     */
    private get settings(): ISecretAppSettings {
        return this.appConfig.secrets;
    }

    /**
     *
     *
     * @param {string} name
     * @returns {Promise<string>}
     * @memberof SecretService
     */
    public async get(name: string): Promise<string> {
        await this.storageClient.bucket(this.settings.crypto.storage.bucket).file(this.getRemote(name)).download({destination: this.getLocal(name)});
        const cipherString = await promisify(fs.readFile)(this.getLocal(name), {encoding: 'utf8'});
        const result = await this.kmsClient.decrypt({name: this.getCryptoName(), ciphertext: cipherString});
        const plaintext = result[0].plaintext.toString();
        await promisify(fs.unlink)(this.getLocal(name));
        return plaintext;
    }

    /**
     *
     *
     * @param {string} name
     * @param {string} plaintext
     * @returns {Promise<void>}
     * @memberof SecretService
     */
    public async set(name: string, plaintext: string): Promise<void> {
        const result = await this.kmsClient.encrypt({name: this.getCryptoName(), plaintext: Buffer.from(plaintext).toString('base64')});
        const cipher = result[0].ciphertext.toString('base64');
        await promisify(fs.writeFile)(this.getLocal(name), cipher);
        await this.storageClient.bucket(this.settings.crypto.storage.bucket).upload(this.getLocal(name), {destination: this.getRemote(name)});
        await promisify(fs.unlink)(this.getLocal(name));
    }

    /**
     *
     *
     * @private
     * @param {string} name
     * @returns {string}
     * @memberof SecretService
     */
    private getRemote(name: string): string {
        return Path.join(this.settings.crypto.storage.remoteDir, `${name}.${this.settings.crypto.storage.fileExtension}`).replace(/\\/g, '/');
    }

    /**
     *
     *
     * @private
     * @param {string} name
     * @returns {string}
     * @memberof SecretService
     */
    private getLocal(name: string): string {
        return Path.join(this.settings.crypto.storage.localTempDir, `${name}.${this.settings.crypto.storage.fileExtension}`);
    }

    /**
     *
     *
     * @private
     * @returns {string}
     * @memberof SecretService
     */
    private getCryptoName(): string {
        return  this.kmsClient.cryptoKeyPath(
            this.settings.crypto.kms.projectId,
            this.settings.crypto.kms.locationId,
            this.settings.crypto.kms.keyRingId,
            this.settings.crypto.kms.cryptoKeyId
        );
    }
}