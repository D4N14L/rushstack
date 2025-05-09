// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as fs from 'node:fs';

interface IInterface {
  element: string;
}

describe('Example Test', () => {
  it('Correctly tests stuff', () => {
    expect(true).toBeTruthy();
  });

  it('Correctly handles snapshots', () => {
    expect({ a: 1, b: 2, c: 3 }).toMatchSnapshot();
  });

  it('Correctly handles TypeScript constructs', () => {
    const interfaceInstance: IInterface = {
      element: 'a'
    };
    expect(interfaceInstance).toBeTruthy();
  });

  it('Correctly handles copying of static assets', () => {
    const filePath: string = `${__dirname}/static-asset.json`;
    expect(fs.existsSync(filePath)).toBeTruthy();
    const fileContents: string = fs.readFileSync(filePath, 'utf8');
    const parsedContents: Record<string, string> = JSON.parse(fileContents);
    expect(parsedContents).toBeTruthy();
    expect(parsedContents).toEqual({ foo: 'bar' });
  });
});
