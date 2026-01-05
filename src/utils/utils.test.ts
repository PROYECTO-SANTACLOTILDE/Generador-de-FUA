import {describe, expect, test} from '@jest/globals';   
import { isValidUUIDv4 } from "./utils";

describe('Utils - isValidUUIDv4 function', () => {
    const validUUID = '3f8c2b6e-9d7a-4c3b-9f2e-8b1a6d4f5c90';
    test('Check valid uudv4: ', () => {
    expect(isValidUUIDv4(validUUID)).toBe(true);
  });
});