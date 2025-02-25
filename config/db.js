require('dotenv').config();
const mysql = require('mysql2');
const ApiError = require('../utils/ApiError');
let db;
function handleDisconnect() {
  db = mysql
    .createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      enableKeepAlive: true,
      waitForConnections: true,
      connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
      queueLimit: 0
    })
    .on('error', (err) => {
      console.error('[Database error]:', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
        console.log('Connection lost, reconnecting...');
        handleDisconnect();
      } else {
        throw err;
      }
    })
    .on('connection', () => console.log('[Connection to database established]'))
    .on('acquire', () => console.log('[Connection to database acquired]'));
}
handleDisconnect();

class QueryBuilder {
  constructor() {
    this.query = '';
    this.params = [];
  }

  select(table, columns = ['*']) {
    if (!Array.isArray(columns)) {
      columns = [columns];
    }
    columns = columns.join(', ');
    this.query = `SELECT ${columns} FROM ${process.env.DB_NAME}.${table} `;
    return this;
  }

  insert(table, values) {
    const columns = Object.keys(values).join(', ');
    const placeholders = Object.keys(values)
      .map(() => '?')
      .join(', ');
    this.query = `INSERT INTO ${process.env.DB_NAME}.${table} (${columns}) VALUES (${placeholders}) `;
    this.params = Object.values(values);
    return this;
  }

  // values = [{column1: value1, column2: value2}, {column1: value3, column2: value4}]
  insertMany(table, values) {
    const columns = Object.keys(values[0]).join(', ');
    const placeholders = values
      .map(
        () =>
          `(${Object.keys(values[0])
            .map(() => '?')
            .join(', ')})`
      )
      .join(', ');
    this.query = `INSERT INTO ${process.env.DB_NAME}.${table} (${columns}) VALUES ${placeholders} `;
    this.params = values.flatMap((row) => Object.values(row));
    return this;
  }

  update(table, values) {
    const updates = Object.keys(values)
      .map((key) => `${key} = ?`)
      .join(', ');
    this.query = `UPDATE ${process.env.DB_NAME}.${table} SET ${updates} `;
    this.params = Object.values(values);
    return this;
  }

  delete(table) {
    this.query = `DELETE FROM ${process.env.DB_NAME}.${table} `;
    return this;
  }

  // columns = ['category_id','status_id'] & operators = ['=','='] & values = [x,y]
  where(columns, operators, values, joiners = ' AND ') {
    this.query += `WHERE `;
    for (let i = 0; i < columns.length; i++) {
      this.query += `${columns[i]} ${operators[i]} ? `;
      this.params.push(values[i]);
      if (i < columns.length - 1) {
        if (Array.isArray(joiners)) {
          this.query += joiners.shift();
        } else {
          this.query += joiners;
        }
      }
    }
    return this;
  }

  // LHS is joined table, RHS is original table
  // if isMultipleCondition = true, onLHS = ['category_id','status_id'] & onRHS = ['x','y']
  join(table, onLHS, onRHS, isMultipleCondition = false) {
    let on = '';
    if (isMultipleCondition) {
      on = onLHS.map((key, index) => `${key} = ${onRHS[index]}`).join(' AND ');
    } else {
      on = `${onLHS} = ${onRHS}`;
    }
    this.query += `JOIN ${process.env.DB_NAME}.${table} ON ${on} `;
    return this;
  }

  // LHS is joined table, RHS is original table
  leftJoin(table, onLHS, onRHS, isMultipleCondition = false) {
    let on = '';
    if (isMultipleCondition) {
      on = onLHS.map((key, index) => `${key} = ${onRHS[index]}`).join(' AND ');
    } else {
      on = `${onLHS} = ${onRHS}`;
    }
    this.query += `LEFT JOIN ${process.env.DB_NAME}.${table} ON ${on} `;
    return this;
  }

  limit(page, limit = 10) {
    page = +page;
    if (!page || page < 1) return this;
    const offset = (page - 1) * limit;
    this.query += `LIMIT ? OFFSET ?`;
    this.params.push(limit, offset);
    return this;
  }

  with(partitionColumn) {
    this.query = this.query.replace('SELECT', `SELECT ROW_NUMBER() OVER(PARTITION BY ${partitionColumn}) AS row_num,`);
    this.query = `WITH temp_result AS (${this.query}) SELECT * FROM temp_result WHERE row_num = 1 `;
    return this;
  }

  orderBy(column, order = 'ASC') {
    this.query += `ORDER BY ${column} ${order} `;
    return this;
  }

  groupBy(columns) {
    this.query += `GROUP BY ${columns.join(', ')} `;
    return this;
  }

  async run(query = null, params = null) {
    try {
      if (query && params) {
        this.query = query;
        this.params = params;
      }
      console.log(this.query, this.params);
      const [rows] = await db.promise().query(this.query, this.params);
      return { success: true, data: rows };
    } catch (error) {
      const errorDetails = {
        message: error.message || 'Unknown error',
        code: error.code || 'UNKNOWN_CODE',
        sqlMessage: error.sqlMessage || null
      };

      if (process.env.NODE_ENV === 'development') {
        console.error('[DB Query Error]:', JSON.stringify(errorDetails, null, 2));
      }

      const dbErrorMessages = {
        ER_DUP_ENTRY: (error) => {
          const match = error.sqlMessage.match(/Duplicate entry '(.+?)' for key '(.+?)'/);
          const value = match ? match[1] : 'unknown value';
          const key = match ? match[2] : 'unknown key';
          return `Duplicate entry detected. The value '${value}' already exists for the unique key '${key}'.`;
        },
        ER_DUP_KEY: () => 'Duplicate key error. A unique constraint was violated.',
        ER_NO_SUCH_TABLE: (error) => {
          const match = error.sqlMessage.match(/Table '(.+?)'/);
          const tableName = match ? match[1] : 'unknown table';
          return `The specified table '${tableName}' does not exist. Please verify the table name.`;
        },
        ER_NO_REFERENCED_ROW: (error) => {
          const match = error.sqlMessage.match(/foreign key constraint fails \(`(.+?)`\.`(.+?)`/);
          const tableName = match ? match[2] : 'unknown table';
          return `A foreign key constraint failed. The referenced table '${tableName}' does not contain the required value.`;
        },
        ER_NO_REFERENCED_ROW_2: (error) => {
          const match = error.sqlMessage.match(/foreign key constraint fails \(`(.+?)`\.`(.+?)`/);
          const tableName = match ? match[2] : 'unknown table';
          return `A foreign key constraint failed. The referenced table '${tableName}' does not contain the required value.`;
        },
        ER_ROW_IS_REFERENCED_2: (error) => {
          const match = error.sqlMessage.match(/constraint `(.+?)` foreign key/);
          const constraint = match ? match[1] : 'unknown constraint';
          return `Cannot delete or update a parent row due to a foreign key constraint '${constraint}'. Ensure related records are handled first.`;
        }
      };

      if (errorDetails.code in dbErrorMessages) {
        throw ApiError.badRequest(dbErrorMessages[errorDetails.code](errorDetails));
      }

      throw ApiError.internal(errorDetails.sqlMessage || 'An unexpected database error occurred. Please contact support.');
    }
  }
}

module.exports = QueryBuilder;
