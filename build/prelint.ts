import { readFile, walkDirectory } from './helpers/fs.helpers';
import { bailIfFailures, Failure } from './helpers/utility.helpers';

(() => {
  const failures: Failure[] = [];

  walkDirectory('.', filePath => {
    if (!filePath.includes('.git')) {
      const fileContents = readFile(filePath);
      failures.push(...checkForEmptyFiles(filePath, fileContents));
      failures.push(...checkForLeadingWhitespace(filePath, fileContents));
    }
  });

  bailIfFailures(failures);
})();

function checkForEmptyFiles(filePath: string, fileContents: string) {
  const fileIsEmpty = fileContents.trim().length === 0;
  const failures: Failure[] = fileIsEmpty ? [{ filePath, message: 'File is empty.' }] : [];
  return failures;
}

function checkForLeadingWhitespace(filePath: string, fileContents: string) {
  const fileHasLeadingWhitespace = /^\s/.test(fileContents);
  const failures: Failure[] = fileHasLeadingWhitespace ? [{ filePath, message: 'File has leading whitespace.' }] : [];
  return failures;
}
