import {
  circularMessage3,
  messageFunction3,
} from "./circularMessage3"

export const circularMessage4 = 'This is another message'
export const messageFunction4 = () => 'As you can see, functions'
export const circularMessage5 = circularMessage3 + ' when the circular dependency is at the end of the chain.'
export const messageFunction5 = () => messageFunction3() + ' better with circular dependencies!'