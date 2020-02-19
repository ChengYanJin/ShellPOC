import React from 'react';
import ReactDOM from 'react-dom';
import { corsImport } from 'webpack-external-import';

import { Navbar } from '@scality/core-ui';

const tabs = [
  {
    selected: false,
    title: 'metalK8s',
    onClick: () => console.log('metalK8s'),
  },
  {
    selected: false,
    title: 'Zenko',
    onClick: () => console.log('zenko'),
  },
];

const configMap = [
  {
    name: 'metalk8s',
    version: '2.4.2',
    path: 'metalk8s/importManifest.js',
  },
];

Promise.all(
  configMap
    .map(solution => {
      console.log(' solution', solution);
      return solution.path;
    })
    .map(path => corsImport(`${path}?${Date.now()}`)),
).then(() =>
  ReactDOM.render(
    <Navbar productName={'ShellPOC'} tabs={tabs} />,
    document.getElementById('root'),
  ),
);
