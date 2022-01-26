type LinkCellProps = {
  value?: {
    type: string;
    text: string;
    url: string;
  };
};

export function LinkCell({ value }: LinkCellProps) {
  return (
    <td>
      {value?.text ? (
        <a href={value.url} target="_blank" rel="noreferrer nofollow">
          {value.text}
        </a>
      ) : (
        "—"
      )}
    </td>
  );
}
