## Postprocessors only run on prod
Postprocessing the entire bundle is an expensive process.
That's why postprocessors are only run when `NODE_ENV=production`.