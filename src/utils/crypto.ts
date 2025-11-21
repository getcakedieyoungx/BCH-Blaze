import {
    instantiateSecp256k1,
    instantiateSha256,
    instantiateRipemd160,
} from '@bitauth/libauth';

// Singleton instances
let secp256k1Promise: ReturnType<typeof instantiateSecp256k1> | null = null;
let sha256Promise: ReturnType<typeof instantiateSha256> | null = null;
let ripemd160Promise: ReturnType<typeof instantiateRipemd160> | null = null;

export const getSecp256k1 = () => {
    if (!secp256k1Promise) {
        secp256k1Promise = instantiateSecp256k1();
    }
    return secp256k1Promise;
};

export const getSha256 = () => {
    if (!sha256Promise) {
        sha256Promise = instantiateSha256();
    }
    return sha256Promise;
};

export const getRipemd160 = () => {
    if (!ripemd160Promise) {
        ripemd160Promise = instantiateRipemd160();
    }
    return ripemd160Promise;
};
