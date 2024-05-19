import { Injectable } from '@nestjs/common';
import { generateKeyPairSync } from 'crypto';

@Injectable()
export class RsaService {
  public generateRSAKeyPair(passphrase: string) {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase,
      },
    });

    return { publicKey, privateKey };
  }

  public convertKeyToBase64(key: string): string {
    return key.replace(
      /(-----(BEGIN|END)( ENCRYPTED) (PUBLIC|PRIVATE) KEY-----|\n)/g,
      '',
    );
  }
}
