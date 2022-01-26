type NumericCellProps = {
  value: number;
  granularity?: number;
};

export function NumericCell({ value, granularity = 1 }: NumericCellProps) {
  return (
    <td>
      {Number.isNaN(value) || value === undefined
        ? "—"
        : Math.ceil(value / granularity) * granularity}
    </td>
  );
}
