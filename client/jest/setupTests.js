import React from 'react';
import "@testing-library/jest-dom/extend-expect";
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

global.React = React;

window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
});

Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  value: jest.fn(),
});