import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.render(
  <Navbar productName={'ShellPOC'} tabs={tabs} />,
  document.getElementById('root'),
);
