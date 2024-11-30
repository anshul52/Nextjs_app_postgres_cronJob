
import * as cron from 'node-cron';

import fetchUsers from '../../utils/fetchUsers';

//this file is using node-cron package to run the cron job and call the funtion fetchUsers() after every 5 min 

cron.schedule('*/5 * * * *', async () => {      
    console.log(`[CRON] Job started at ${new Date().toISOString()}`);
    try {
      await fetchUsers(); // Fetch and save users
      console.log(`[CRON] Job completed successfully at ${new Date().toISOString()}`);
    } catch (error) {
      console.error(`[CRON] Job failed at ${new Date().toISOString()}:`, error);
    }
  });
console.log('[SERVER] Cron job initialized.');
