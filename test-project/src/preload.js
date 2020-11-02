import 'bundlerb/client/bequire'

// this is added in case there are complicated circular dependencies in the project
// it will suspend the loading sequence untill all modules have been defined
// and then when define.resume() is called the modules actually get loaded in sequence
define.suspend()
