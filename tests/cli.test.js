const tap = require('tap');
const { readFileSync } = require('fs');
const { execSync, spawnSync } = require('child_process');

const README = readFileSync('./README.md').toString('utf-8').split('\n');

function getCommand(comment) {
  let command = README.find((line) => line.endsWith(comment));
  const index = README.indexOf(command) + 1;
  let output = [];

  for (let i = index; i < README.length; i++) {
    if (README[i] === '```') break;
    output.push(README[i]);
  }

  return [command.slice(2), output.join('\n') + '\n'];
}

tap.test('Give the readme examples', (t) => {
  t.plan(9);

  t.test('Should show help', (t) => {
    t.plan(1);
    const [command, output] = getCommand('# showHelp');
    const cmd = command.split(' ');
    const result = spawnSync(cmd[0], cmd.slice(1, -2), { encoding: 'utf-8' });

    t.same(result.stderr, output);
  });

  t.test('Should return all context in stdout', (t) => {
    t.plan(1);
    const [command, output] = getCommand('# showContext');
    const result = execSync(command, { encoding: 'utf-8' });

    t.same(result, output);
  });

  t.test('Should return part of context in stdout', (t) => {
    t.plan(1);
    const [command, output] = getCommand('# showContextSelector');
    const result = execSync(command, { encoding: 'utf-8' });

    t.same(result, output);
  });

  t.test('Should return part of context in stdout', (t) => {
    t.plan(1);
    const [command, output] = getCommand('# showContextSelectorJson');
    const result = execSync(command, { encoding: 'utf-8' });

    t.same(result, output);
  });

  t.test('Should render the mapping', (t) => {
    t.plan(1);
    const [command, output] = getCommand('# renderMapping');
    const result = execSync(command, { encoding: 'utf-8' });

    t.same(result, output);
  });

  t.test('Should render the example template', (t) => {
    t.plan(1);
    const [command, output] = getCommand('# renderTemplate');
    const result = execSync(command, { encoding: 'utf-8' });

    t.same(result, output);
  });

  t.test('Should render the example template in human readable format', (t) => {
    t.plan(1);
    const [command, output] = getCommand('# renderHumanReadable');
    const result = execSync(command, { encoding: 'utf-8' });

    t.same(result, output);
  });

  t.test('Should render the example template in human readable format', (t) => {
    t.plan(1);
    const [command, output] = getCommand('# renderHumanReadableLimitTo');
    const result = execSync(command, { encoding: 'utf-8' });

    t.same(result, output);
  });

  t.test('Should render the example template in human readable format', (t) => {
    t.plan(1);
    const [command, output] = getCommand('# renderFileContent');
    const result = execSync(command, { encoding: 'utf-8' });

    t.same(result, output);
  });
});
