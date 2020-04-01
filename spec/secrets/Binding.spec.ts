import 'reflect-metadata';
import { Container } from 'inversify';
import { IGoogleCloudFactory } from '../../src/IGoogle.Cloud.Factory';
import { GoogleCloudFactory } from '../../src/Google.Cloud.Factory';
import { GoogleCloudSecretSymbols } from '../../src/Secrets.Symbols';
import { ISecretService, Secrets } from '@trapize/secrets-management';
import { SecretService } from '../../src/Secret.Service';

describe('Secret Module Binding', () => {
    it('should bind', () => {
        const container = new Container();
        container.bind<IGoogleCloudFactory>(GoogleCloudSecretSymbols.IGoogleCloudFactory).to(<any>GoogleCloudFactory);
        container.bind<ISecretService>(Secrets.ISecretService).to(SecretService);

        expect(container.isBound(GoogleCloudSecretSymbols.IGoogleCloudFactory)).toBeTruthy();
        expect(container.isBound(Secrets.ISecretService)).toBeTruthy();
    })
})