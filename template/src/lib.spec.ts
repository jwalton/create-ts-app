import chai from 'chai';
import 'mocha';
import { add } from './lib.js';

const { expect } = chai;

describe('Test Suite', function () {
    it('should add two numbers', function () {
        expect(add(2, 3)).to.equal(5);
    });
});
