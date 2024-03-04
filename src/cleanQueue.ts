/* eslint-disable no-console */
import { RedisCacheProvider } from './gateways/database/cache-gateway';
import { HorasDoDia } from './types/enums/hours-of-day.enum';
import { MesesDoAno } from './types/enums/month-of-year.enum';
import { DiasDaSemana } from './types/enums/day-of-week.enum';

const schedule = require('node-schedule');

const MINUTE = '*/1';
const HOUR = HorasDoDia.TODOS;
const DAY_OF_MONTH = '*';
const MONTH = MesesDoAno.TODOS;
const DAY_OF_WEEK = DiasDaSemana.TODOS;

const TIMER = `${MINUTE} ${HOUR} ${DAY_OF_MONTH} ${MONTH} ${DAY_OF_WEEK}`;

async function cleanQueue(client) {
  console.log('cleaning queue');
  const key = 'semaphore';
  try {
    const currentDateTime = new Date();
    const currentDateInBrasilaTime = new Date(
      currentDateTime.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }),
    ).getTime();

    const oldestRequest = await client.getArrayValue({
      key, index: 0,
    });

    if (!oldestRequest) {
      console.log('nothing cleanead');

      return { ok: true };
    }

    const oldestRequestDateTime = new Date(oldestRequest.created_at).getTime();
    const timeDifference = currentDateInBrasilaTime - oldestRequestDateTime;
    const oneMinute = 60000;

    if (!timeDifference || timeDifference >= oneMinute || timeDifference <= -oneMinute) {
      console.log('cleanead');
      await client.removeArrayItem({ key, value: oldestRequest });
    } else {
      console.log('nothing cleanead');
    }

    return { ok: true };
  } catch (e) {
    await client.removeFirstItemOfArray(key);
    console.log(e.message);
    return { ok: true };
  }
}

export function jobCleanQueue(): void {
  const client = new RedisCacheProvider();
  cleanQueue(client);

  schedule.scheduleJob(TIMER, () => cleanQueue(client));
}
