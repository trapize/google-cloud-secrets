![](https://github.com/trapize/google-cloud-secrets/workflows/Unit%20Tests/badge.svg)
# Google Cloud Secrets
Provides an extensible framework design around ease of use to remove much of the boiler plate code for web APIs.

## Installation
`npm install --save @trapize/google-cloud-secrets`

## Configure
In your `IAppConfig` for your application, include a `secrets: ISecretAppSettings` property, and include the provided `SecretModule` in your modules.

```javascript
import { IAppConfig } from '@trapize/core';
import { ISecretConfig, SecretsModule } from '@trapize/google-cloud-secrets';

export const MyAppConfig: IAppConfig & ISecretConfig = {
    modules: [
        // ...
        SecretsModule
    ],
    // ...
    secrets: {
        crypto: {
            kms: {
                account: 'path/to/keyfile',
                projectId: 'projectId-12389,
                locationId: 'global',
                keyRingId: 'keyring',
                cryptoKeyId: 'key'
            },
            storage: {
                account: 'path/to/keyfile',
                bucket: 'bucket',
                localTempDir: 'temp/',
                remoteDir: 'secrets',
                fileExtension: 'enc'
            }
        }
    },
    // ...
}
```

## Usage
Checkout the wiki for usage.

https://github.com/trapize/google-cloud-secrets.wiki.git

## MIT

Copyright (c) 2020 ztrank

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
