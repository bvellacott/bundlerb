require('bueno-repo').setupDependencyAliases()
const shell = require('shelljs')
const { requireBundlerbConfig } = require('bundlerb/utils')
const { ssrPaths = [], port } = requireBundlerbConfig()

if (!shell.which('wget')) {
  shell.echo('Sorry, this script requires wget')
  shell.exit(1);
}

shell.echo('! remember to start the prod server before building !')

shell.rm('-rf', 'dist')
shell.mkdir('dist')
shell.cd('dist')
ssrPaths.forEach(path =>
  shell.exec(`wget -r -nH http://localhost:${port}${path}`))
