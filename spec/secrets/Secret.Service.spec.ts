import 'reflect-metadata';
import { ISecretService } from '@trapize/secrets-management';
import { SecretService } from '../../src/Secret.Service';
import * as Path from 'path';
import * as fs from 'fs';

const appSettings = {
    secrets: {
        crypto: {
            kms: {
                account: 'account',
                projectId: 'projectId',
                locationId: 'locationId',
                keyRingId: 'keyRingId',
                cryptoKeyId: 'cryptoKeyId'
            },
            storage: {
                account: 'account',
                bucket: 'bucket',
                localTempDir: 'localTempDir',
                remoteDir: 'remoteDir',
                fileExtension: 'encrypted'
            }
        }
    }
};

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    readFile: jest.fn(),
    unlink: jest.fn().mockImplementation((name, callback) => {
        callback();
    }),
    writeFile: jest.fn()
}));

function mockWriteFile(name: string, value: any): void {
    (<jest.Mock<any,any>><any>fs.writeFile).mockImplementation((path, file, callback) => {
        expect(path).toBe(Path.join(appSettings.secrets.crypto.storage.localTempDir, `${name}.${appSettings.secrets.crypto.storage.fileExtension}`));
        expect(file).toBe(value);
        callback();
    });
}

function mockReadFile(path: string, retVal: any): void {
    (<jest.Mock<any,any>><any>fs.readFile).mockImplementation((path, options, callback) => {
        expect(path).toBe(path);
        callback(undefined, retVal);
    });
}

const kms = {
    cryptoKeyPath: jest.fn().mockImplementation((...args: string[]) => {
        return Path.join(...args);
    }),
    encrypt: jest.fn(),
    decrypt: jest.fn()
};

const file = {
    download: jest.fn()
};

const bucket = {
    file: jest.fn().mockImplementation(() => {
        return file;
    }),
    upload: jest.fn()
};

const storage = {
    bucket: jest.fn().mockImplementation(() => {
        return bucket;
    })
};

beforeEach(() => {
    kms.encrypt.mockReset();
    kms.decrypt.mockReset();

    file.download.mockReset();
    bucket.file.mockClear();
    bucket.upload.mockReset();
    storage.bucket.mockClear();
    (<jest.Mock<any,any>><any>fs.readFile).mockReset();
    (<jest.Mock<any,any>><any>fs.writeFile).mockReset();
    (<jest.Mock<any,any>><any>fs.unlink).mockClear();
});

function CryptService(): ISecretService {
    return new SecretService(<any>appSettings, <any>{}, kms, storage);
}

const key = Path.join(appSettings.secrets.crypto.kms.projectId, appSettings.secrets.crypto.kms.locationId, appSettings.secrets.crypto.kms.keyRingId, appSettings.secrets.crypto.kms.cryptoKeyId);

describe('Secret Service', () => {
    it('Should use the factory', () => {
        const factory = {
            KMS: jest.fn(),
            Storage: jest.fn()
        };

        const service = new SecretService(<any>appSettings, factory);
        expect(service).toBeDefined();
        expect(factory.KMS).toHaveBeenCalledTimes(1);
        expect(factory.Storage).toHaveBeenCalledTimes(1);
    });

    it('Should upload', async () => {
        const service = CryptService();
        const plaintext = 'password';
        const cipher = Buffer.from('encrypted', 'base64');
        const name = 'testPassName';
        kms.encrypt.mockImplementation(options => {
            expect(options.name).toBe(Path.join(key));
            expect(options.plaintext).toBe(Buffer.from(plaintext).toString('base64'));
            return Promise.resolve([{ciphertext: cipher}])
        });
        mockWriteFile(name, cipher.toString('base64'));

        await service.set(name, plaintext);
    });

    it('Should get', async () => {
        const service = CryptService();
        const name = 'testPassName';
        const cipher = Buffer.from('encrypted', 'base64');
        const plaintext = 'password';
        const localPath = Path.join(appSettings.secrets.crypto.storage.localTempDir, `${name}.${appSettings.secrets.crypto.storage.fileExtension}`);
        kms.decrypt.mockImplementation(options => {
            expect(options.name).toBe(key);
            expect(options.ciphertext).toBe(cipher);
            return Promise.resolve([{plaintext: plaintext}]);
        });

        file.download.mockImplementation(options => {
            expect(options.destination).toBe(localPath);
            return Promise.resolve();
        });

        mockReadFile(localPath, cipher);

        const password = await service.get(name);
        expect(password).toBe(plaintext);
    });
})