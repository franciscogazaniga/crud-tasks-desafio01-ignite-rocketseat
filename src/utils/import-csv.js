import fs from 'fs';
import { parse } from 'csv-parse';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

// const __dirname = dirname(fileURLToPath('../..'));

export const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`/Users/franciscoeduardo/Documents/Programacao/Rocketseat/Ignite/NodeJS/desafios/desafio-01-crud-tasks/tasks.csv`)
    .pipe(parse({
    // CSV options if any
      delimiter: ',',
      header: true,
    }));
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  // console.info(records);
})();

const tasksFile = await processFile()

// const [title, description] = tasksFile[1]

// console.log(title)

if(tasksFile) {
  let task = 1

  while(task < (await tasksFile).length) {
    const [title, description] = tasksFile[task]
    // console.log('Title: ', title, 'Description: ', description)

    task++
  }
}