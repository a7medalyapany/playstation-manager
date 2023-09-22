import moment from "moment";

import { Sql } from "./sqlite3";
import { IPC } from '../common/constants'
import { Playstation, PlaystationType } from "../src/types";

import { BrowserWindow, ipcMain } from "electron";

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

		  function calculateHourlyPrice(PlayStationType: string): number {
			switch (PlayStationType) {
			  case PlaystationType.PS3:
			  return 15.0;
			  case PlaystationType.PS4:
			  return 20.0;
			  case PlaystationType.PS5:
			  return 25.0;
			  default:
			  return 0.0;
			}
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

			  ipcMain.handle(IPC.getSession, async (_, args) => {
				try {
				  const { PlayStationID } = args;
				  const session = await sql.selectOne('Sessions', `WHERE PlayStationID = ${PlayStationID} AND EndTime IS NULL`);
				  const EstimateEndTime = moment().format('YYYY-MM-DD HH:mm:ss');
			  
				  const { HourlyPrice } = await sql.selectOne('PlayStations', `WHERE PlayStationID = ${PlayStationID}`);
				  const startTime = moment(session.StartTime);
				  const endTimeMoment = moment(EstimateEndTime);
				  const duration = moment.duration(endTimeMoment.diff(startTime));
				  const durationInMinutes = duration.asMinutes();
				  const totalAmount = (HourlyPrice * session.PlayersNumber * (durationInMinutes / 60)).toFixed(2);

			  
				  if (!session) {
					return {
					  code: 0,
					  msg: 'No active session found for the specified PlayStation',
					};
				  }
			  
				  // Format the duration
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
				  const HourlyPrice = calculateHourlyPrice(PlayStationType);
		  
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
			  
				  const { HourlyPrice } = await sql.selectOne('PlayStations', `WHERE PlayStationID = ${PlayStationID}`);
				  const startTime = moment(session.StartTime);
				  const endTimeMoment = moment(endTime);
				  const duration = moment.duration(endTimeMoment.diff(startTime));
				  const durationInMinutes = duration.asMinutes();
				  const totalAmount = (HourlyPrice * session.PlayersNumber * (durationInMinutes / 60)).toFixed(2);
			  
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