import got from 'got';
import {expect, jest, test} from '@jest/globals';

// Exercices
// NodeJs
// Exercice: Is there a problem? (1 points)

// Call web service and return count user, (got is library to call url)
async function getCountUsers() {
    return { total: await got.get('https://my-webservice.moveecar.com/users/count') };
  }
  
  // Add total from service with 20
  async function computeResult() {
    const result = await getCountUsers();
    const { total } = result;
    return Number(total) + 20;
  }
  
// Exercice: Is there a problem? (2 points)

// Call web service and return total vehicles, (got is library to call url)
async function getTotalVehicles() {
  return await got.get('https://my-webservice.moveecar.com/vehicles/total');
}

async function getPlurial() {
  const total = Number(await getTotalVehicles());
  if (total <= 0) {
      return 'none';
  }
  if (total <= 10) {
      return 'few';
  }
  return 'many';
}

// Exercice: Unit test (2 points)
// Write unit tests in jest for the function below in typescript

function getCapitalizeFirstWord(name: string | null): string {
  if (name == null) {
    throw new Error('Failed to capitalize first word with null');
  }
  if (!name) {
    return name;
  }
  return name.split(' ').map(
    n => n.length > 1 ? (n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()) : n
  ).join(' ');
}

test('1. test', async function () {
  const word = getCapitalizeFirstWord('test');
  expect(word).toBe('Test');
});
test('2. test', async function () {
  const word = getCapitalizeFirstWord('test test');
  expect(word).toBe('Test Test');
});
test('3. test', async function () {
  const word = getCapitalizeFirstWord(null);
  expect(word).toThrowError('Failed to capitalize first word with null');
});
