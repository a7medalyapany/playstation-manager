import moment from "moment";

import { Sql } from "./sqlite3";
import { IPC } from '../common/constants';
import { Playstation } from "../src/types";

import { calculateHourlyPrice, handleHourlyPriceChange } from '../src/functions/price';

import { BrowserWindow, ipcMain } from "electron";

const storage = require('electron-json-storage');


export class Ipc{
	constructor(
		public win: BrowserWindow,
		public sql: Sql,
	){
			async function getNextAutoIncrementedID(tableName: string): Promise<number> {
				return new Promise<number>((resolve, reject) => {
				const query = `SELECT MAX(PlayStationID) as maxID FROM ${tableName}`;
				sql.database.get(query, (err: any, row: { maxID: number }) => {
					if (err) {
					reject(err);
					} else {
					resolve(row ? row.maxID + 1 : 1);
					}
				});
				});
			}		  

			async function checkAndClearTables() {
				let sessionsCount = await sql.getCount('Sessions');
				let billingCount = await sql.getCount('Billing');
		  
				if (sessionsCount >= 50) {
				  await sql.deleteFirst40Rows('Sessions');
				  sessionsCount = 0;
				}
		  
				if (billingCount >= 50) {
				  await sql.deleteFirst40Rows('Billing');
				  billingCount = 0;
				}
			  }

			  ipcMain.handle(IPC.Delete, async (_, args) => {
				try{
					const { PlayStationName } = args;
					const res = await sql.delete('PlayStations', `WHERE PlayStationName = '${PlayStationName}' AND IsAvailable = 1`);
					return {
						code: 1,
						msg: res,
					  }
				  } catch (e) {
					return {
					  code: 0,
					  msg: e,
					}
				}
			  })

			  ipcMain.handle(IPC.Reset, async (_) => {
				try {
					await sql.delete('PlayStations','');
					await sql.delete('Sessions','');
					await sql.delete('Billing','');
					return {
						code:1,
					}
				}
				 catch (e) {
					return {
					  code: 0,
					  msg: e,
					}
				}
			  })

			  ipcMain.handle(IPC.getPass, async() => {
				try {
					const res = await storage.getSync('myData');
					const password = res.credentials.password;
					return {
						code:1,
						password,
					}
				}
				 catch (e) {
					return {
					  code: 0,
					  msg: e,
					}
				}
			  })

			  ipcMain.handle(IPC.UpdatePrice, async (_, args) => {
				try{
					const { PlayStationType, NewPrice} = args;

					storage.get('myData', function(error: any, data: { prices: { [x: string]: { price: any; }; }; }) {
						if (error) throw error;

					data.prices[PlayStationType].price = NewPrice;
					storage.set('myData', data, function(error: any) {
						if (error) throw error;
						console.log('Price updated successfully');
					  });
					});

					const res = await sql.update('PlayStations', `SET HourlyPrice = ${NewPrice} WHERE PlayStationType = '${PlayStationType}'`);
					return {
						code: 1,
						msg: res,
					  }
				  } catch (e) {
					console.error('Error updating price:', e);
					return {
					  code: 0,
					  msg: e,
					}
				}
			  })

			  ipcMain.handle(IPC.UpdataPassword, async (_, args) => {
				try{
					const { newPassword } = args;

					storage.get('myData', function(error: any, data: { credentials: { password: any; }; }) {
						if (error) throw error;
					
						data.credentials.password = newPassword;
					
						storage.set('myData', data, function(error: any) {
						if (error) throw error;
						console.log('Password updated successfully');
						});
					});
					
					return {
						code: 1,
					}
			  	} catch (e) {
					console.error('Error updating password:', e);
				  return {
					code: 0,
					msg: e,
				  }
			  	}
			  })


			  ipcMain.handle(IPC.getSession, async (_, args) => {
				try {
				  const { PlayStationID } = args;
				  const session = await sql.selectOne('Sessions', `WHERE PlayStationID = ${PlayStationID} AND EndTime IS NULL`);
				  const EstimateEndTime = moment().format('YYYY-MM-DD HH:mm:ss');
			  
				  const { PlayStationType } = await sql.selectOne('PlayStations', `WHERE PlayStationID = '${PlayStationID}'`);
				  const startTime = moment(session.StartTime);
				  const endTimeMoment = moment(EstimateEndTime);
				  const duration = moment.duration(endTimeMoment.diff(startTime));
				  const durationInMinutes = duration.asMinutes();
				  const totalAmount = (calculateHourlyPrice(PlayStationType , session.PlayersNumber) * (durationInMinutes / 60)).toFixed(2);

				  if (!session) {
					return {
					  code: 0,
					  msg: 'No active session found for the specified PlayStation',
					};
				  }
			  
				  const hours = Math.floor(durationInMinutes / 60);
				  const minutes = Math.floor(durationInMinutes % 60);
				  const formattedDuration = `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} min${minutes > 1 ? 's' : ''}`;
			  
				  return {
					code: 1,
					msg: {
					  totalAmount,
					  formattedDuration,
					},
				  };
				} catch (e) {
				  return {
					code: 0,
					msg: e,
				  };
				}
			  });
			  
			ipcMain.handle(IPC.createPlaystation, async (_, args) => {
				try {
				  const { PlayStationType } = args
				  const HourlyPrice = handleHourlyPriceChange(PlayStationType);
		  
				  const PlayStationName = `${PlayStationType}-R${await getNextAutoIncrementedID('PlayStations')}`;
				  
				  const res = await sql.insert('Playstations', { PlayStationType, PlayStationName, IsAvailable: 1, HourlyPrice });
					return {
					  code: 1,
					  msg: res,
					}
				} catch (e) {
				  return {
					code: 0,
					msg: e,
				  }
				}
			  })

			  ipcMain.handle(IPC.getAllPlaystations, async () => {
				try {
					const res = await sql.selectAll('Playstations', '');

			  		return res as Playstation[]
					} catch (e) {
						return {
							code: 0,
							msg: e,
						};
					}
			  });

			  ipcMain.handle(IPC.Reserve, async (_, args) => {
				try {
				  const { PlayStationID, PlayersNumber } = args;

				  checkAndClearTables();

				  await sql.update('PlayStations', `SET IsAvailable = 0 WHERE PlayStationID = ${PlayStationID}`);
			  
				  const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
				  const sessionRes = await sql.insert('Sessions', { StartTime: startTime, PlayStationID, PlayersNumber: PlayersNumber });
			  
				  return {
					code: 1,
					msg: sessionRes,
				  };
				} catch (e) {
				  return {
					code: 0,
					msg: e,
				  };
				}
			  });

			  ipcMain.handle(IPC.End, async (_, args) => {
				try {
				  const { PlayStationID } = args;

				  checkAndClearTables();
			  
				  const session = await sql.selectOne('Sessions', `WHERE PlayStationID = ${PlayStationID} AND EndTime IS NULL`);
			  
				  if (!session) {
					return {
					  code: 0,
					  msg: 'No active session found for the specified PlayStation',
					};
				  }
			  
				  const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
				  await sql.update('Sessions', `SET EndTime = '${endTime}' WHERE SessionID = ${session.SessionID}`);
				  const { PlayStationType } = await sql.selectOne('PlayStations', `WHERE PlayStationID = '${PlayStationID}'`);
				  const startTime = moment(session.StartTime);
				  const endTimeMoment = moment(endTime);
				  const duration = moment.duration(endTimeMoment.diff(startTime));
				  const durationInMinutes = duration.asMinutes();
				  const totalAmount = (calculateHourlyPrice(PlayStationType , session.PlayersNumber) * (durationInMinutes / 60)).toFixed(2);
			  
				  const billingRes = await sql.insert('Billing', { SessionID: session.SessionID, TotalAmount: totalAmount });
			  
				  await sql.update('PlayStations', `SET IsAvailable = 1 WHERE PlayStationID = ${PlayStationID}`);
			  
				  return {
					code: 1,
					msg: billingRes,
				  };
				} catch (e) {
				  return {
					code: 0,
					msg: e,
				  };
				}
			  });
	}
}