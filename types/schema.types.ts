export interface DatabaseSchemaRow {
  table_name: string;
  column_name: string;
  data_type: string;
  relation_table: string | null;
  relation_column: string | null;
  is_pk: string | null;
}

export interface FormattedDatabaseSchemaTable {
  tableName: string;
  columns: {
    table_name: string;
    column_name: string;
    data_type: string;
    relation_table: string | null;
    relation_column: string | null;
    is_pk: string | null;
  }[];
}

export interface FormattedDatabaseSchemaColumn {
  table_name: string;
  column_name: string;
  data_type: string;
  relation_table: string | null;
  relation_column: string | null;
  is_pk: string | null;
}
