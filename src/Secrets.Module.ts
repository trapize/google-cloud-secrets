import { IModule } from '@trapize/core';
import { GoogleCloudFactory } from './Google.Cloud.Factory';
import { GoogleCloudSecretSymbols } from './Secrets.Symbols';
import { SecretService } from './Secret.Service';
import { Secrets } from '@trapize/secrets-management';

export const SecretsModule: IModule = {
    name: 'GoogleCloudSecrets',
    assemblies: [
        {type: GoogleCloudFactory, injectAs: GoogleCloudSecretSymbols.IGoogleCloudFactory, binding: 'CONSTANT'},
        {type: SecretService, injectAs: Secrets.ISecretService, scope: 'SINGLETON'}
    ]
}