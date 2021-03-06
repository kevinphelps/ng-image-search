import { execute } from './helpers/shell.helpers';
import { parseFlags } from './helpers/utility.helpers';

const defaultOptionsFn = () => ({
  prettier: true,
  sasslint: true,
  tslint: true,
  fix: false
});

const options = parseFlags(process.argv.slice(2), defaultOptionsFn);

(async () => {
  await execute('ts-node ./build/prelint.ts');

  if (options.prettier) {
    await runFormatter('ts-node ./build/format-html.ts', '--fix', '--list', options.fix);
    await runFormatter('prettier --config ./prettier.ts.json "./**/*.ts"', '--write', '--list-different', options.fix);
    await runFormatter('prettier --config ./prettier.scss.json "./src/**/*.scss"', '--write', '--list-different', options.fix);
  }

  if (options.sasslint) {
    await execute('sass-lint -v -q --max-warnings 0');
  }

  if (options.tslint) {
    await execute(`tslint --project ./tsconfig.json ${options.fix ? '--fix' : ''}`);
  }
})();

async function runFormatter(command: string, writeArg: string, listDifferentArg: string, fix: boolean) {
  if (fix) {
    do {
      await execute(`${command} ${writeArg}`);
    } while ((await execute(`${command} ${listDifferentArg}`, {}, false)).code !== 0);
  } else {
    await execute(`${command} ${listDifferentArg}`);
  }
}
