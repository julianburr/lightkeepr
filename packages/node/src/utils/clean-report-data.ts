export function cleanReportData(data) {
  // We mainly remove screenshots here, since they take up a lot of the file size

  if (data.audits?.["full-page-screenshot"]?.details?.screenshot) {
    delete data.audits["full-page-screenshot"].details.screenshot;
  }

  if (data.audits?.["final-screenshot"]?.details?.data) {
    delete data.audits["final-screenshot"].details.data;
  }

  if (data.audits?.["screenshot-thumbnails"]?.details?.items) {
    delete data.audits["screenshot-thumbnails"].details.items;
  }

  return data;
}
