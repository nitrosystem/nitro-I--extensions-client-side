export const bindEntity_baseQuery = `
    CREATE PROCEDURE {Schema}.{ProcedureName}
    {SpParams}
    AS BEGIN
        SELECT
            {SelectedColumns}
        FROM 
            {Entity}
        {Filters}
    END
`;