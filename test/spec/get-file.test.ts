// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import Promise from 'pinkie-promise';

import assert from 'assert';
import fs from 'fs';
import mkdirp from 'mkdirp-classic';
import rimraf2 from 'rimraf2';

// @ts-ignore
import get from 'get-remote';

import { TARGET, TMP_DIR } from '../lib/constants';
const URL = 'https://raw.githubusercontent.com/kmalakoff/get-remote/master';

describe('get-file', () => {
  (() => {
    // patch and restore promise
    const root = typeof global !== 'undefined' ? global : window;
    let rootPromise: Promise;
    before(() => {
      rootPromise = root.Promise;
      root.Promise = Promise;
    });
    after(() => {
      root.Promise = rootPromise;
    });
  })();

  beforeEach((callback) => {
    rimraf2(TMP_DIR, { disableGlob: true }, () => {
      mkdirp(TMP_DIR, callback);
    });
  });

  it('should get file over https', (done) => {
    get(`${URL}/package.json`).file(TARGET, (err) => {
      assert.ok(!err, err ? err.message : '');
      const files = fs.readdirSync(TARGET);
      assert.ok(files.length === 1);
      done();
    });
  });

  it('should get file over http', (done) => {
    get(`${URL}/package.json`).file(TARGET, (err) => {
      assert.ok(!err, err ? err.message : '');
      const files = fs.readdirSync(TARGET);
      assert.ok(files.length === 1);
      done();
    });
  });

  it('should support promises', async () => {
    await get(`${URL}/package.json`).file(TARGET);
    const files = fs.readdirSync(TARGET);
    assert.ok(files.length === 1);
  });

  it('should get with progress', (done) => {
    const progressUpdates = [];
    function progress(update) {
      progressUpdates.push(update);
    }

    get(`${URL}/package.json`, { progress: progress }).file(TARGET, (err) => {
      assert.ok(!err, err ? err.message : '');
      const files = fs.readdirSync(TARGET);
      assert.ok(files.length === 1);
      assert.ok(progressUpdates.length > 1);
      done();
    });
  });
});
