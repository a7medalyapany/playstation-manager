import path from 'node:path';
import { app } from 'electron';
import { Database, verbose } from 'sqlite3';

const TAG = '[sqlite3]';

export class Sql {
  private static instance: Sql;

  public static getInstance(filename = path.join(app.getPath('userData'), 'database.sqlite3')) {
    return this.instance ??= new Sql(filename);
  }

  public database: Database;

  private constructor(filename: string) {
    const sqlite3 = verbose();
    this.database = new sqlite3.Database(filename, (error) => {
      if (error) {
        console.log(TAG, 'initialize failed :(');
        console.log(TAG, error);
      } else {
        console.log(TAG, 'initialize success :)');
        console.log(TAG, filename);
      }
    });
  }

  objKey(obj: Record<string, any>) {
    return Object.keys(obj).join(', ');
  }

  objValue(obj: Record<string, any>) {
    return Object.values(obj).map((value) => `'${value}'`).join(', ');
  }

  async insert(tableName: string, values: Record<string, any>): Promise<string> {
    const keys = this.objKey(values);
    const valuePlaceholders = this.objValue(values);
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ${tableName} (${keys}) VALUES (${valuePlaceholders})`;
      this.database.run(query, function (err) {
        if (err) {
          reject(`insert error: ${err}`);
        } else {
          resolve('insert success');
        }
      });
    });
  }

  async update(tableName: string, statement: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ${tableName} ${statement}`;
      this.database.run(query, function (err) {
        if (err) {
          reject(`update data error: ${err.message}`);
        } else {
          console.log('update data: ', this);
          resolve();
        }
      });
    });
  }

  async delete(tableName: string, statement: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM ${tableName} ${statement}`;
      this.database.run(query, function (err) {
        if (err) {
          reject(err.message);
        } else {
          console.log('deleted', this);
          resolve();
        }
      });
    });
  }

  async deleteFirst40Rows(tableName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM ${tableName} WHERE rowid IN (SELECT rowid FROM ${tableName} LIMIT 40)`;
      this.database.run(query, function (err) {
        if (err) {
          reject(err.message);
        } else {
          console.log('Deleted the first 40 rows');
          resolve();
        }
      });
    });
  }
  

  
  async selectAll(tableName: string, statement: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${tableName} ${statement}`;
      this.database.all(query, [], function (err, rows) {
        if (err) {
          reject(`find error: ${err}`);
        } else {
          console.log('select all', rows);
          resolve(rows);
        }
      });
    });
  }

  async selectOne(tableName: string, statement: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${tableName} ${statement}`;
      this.database.get(query, [], function (err, row) {
        if (err) {
          reject(`find error: ${err}`);
        } else {
          console.log('select one', row);
          resolve(row);
        }
      });
    });
  }

  async getCount(tableName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) as count FROM ${tableName}`;
      this.database.get(query, [], function (err, row: any) {
        if (err) {
          reject(`get count error: ${err}`);
        } else {
          console.log('get count', row);
          resolve(row.count);
        }
      });
    });
  }


// Function to create the 'PlayStations' table
createPlayStationsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS PlayStations (
        PlayStationID INTEGER PRIMARY KEY,
        PlayStationType TEXT,
        PlayStationName TEXT,
        IsAvailable BOOLEAN DEFAULT 1,
        HourlyPrice DECIMAL
    );
  `;
  return this.runQuery(createTableSQL);
}

// Function to create the 'Sessions' table
createSessionsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS Sessions (
        SessionID INTEGER PRIMARY KEY,
        StartTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        EndTime TIMESTAMP,
        PlayStationID INTEGER,
        PlayersNumber INTEGER,       
        FOREIGN KEY(PlayStationID) REFERENCES PlayStations(PlayStationID)
    );
  `;
  return this.runQuery(createTableSQL);
}

// Function to create the 'Billing' table
createBillingTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS Billing (
        BillingID INTEGER PRIMARY KEY,
        SessionID INTEGER,
        TotalAmount DECIMAL,
        FOREIGN KEY(SessionID) REFERENCES Sessions(SessionID)
    );
  `;
  return this.runQuery(createTableSQL);
}

// Function to execute SQL queries
public runQuery(query: string): Promise<void> {
  return new Promise((resolve, reject) => {
    this.database.run(query, function (err) {
      if (err) {
        reject(`SQL error: ${err}`);
      } else {
        resolve();
      }
    });
  });
}

// Function to create all tables
async createTables() {
  try {
    await this.createPlayStationsTable();
    await this.createSessionsTable();
    await this.createBillingTable();
    console.log(TAG, 'All tables created successfully');
  } catch (error) {
    console.error(TAG, 'Error creating tables:', error);
  }
}
}

// Add the SQL table creation queries below your class
export const createTablesSQL = `
-- SQL table creation queries (unchanged)
`;