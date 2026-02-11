interface MatrixTableProps<Row, Col> {
  title: string;
  rows: Row[];
  columns: Col[];
  getValue: (row: Row, col: Col) => number | string;
  getRowLabel: (row: Row) => string;
  getColumnLabel: (col: Col) => string;
}

export function MatrixTable<Row, Col>({
  title,
  rows,
  columns,
  getValue,
  getRowLabel,
  getColumnLabel
}: MatrixTableProps<Row, Col>) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg w-full h-full transition-colors duration-300">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b text-left text-gray-700 dark:text-gray-300">
                {""}
              </th>

              {columns.map((col, i) => (
                <th
                  key={i}
                  className="p-2 border-b text-center text-gray-700 dark:text-gray-300"
                >
                  {getColumnLabel(col)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rIndex) => (
              <tr key={rIndex}>
                <td className="p-2 border-b font-medium text-gray-800 dark:text-gray-200">
                  {getRowLabel(row)}
                </td>

                {columns.map((col, cIndex) => (
                  <td
                    key={cIndex}
                    className="p-2 border-b text-center text-gray-700 dark:text-gray-300"
                  >
                    {getValue(row, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
