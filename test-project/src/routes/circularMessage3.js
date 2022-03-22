import {
  circularMessage4,
  messageFunction4
} from "./circularMessage4";

export const circularMessage3 = circularMessage4 + ' for testing circular dependencies'

export const messageFunction3 = () => messageFunction4() + ' work'
