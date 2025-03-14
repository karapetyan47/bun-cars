export const fdToJson = (
  formData: FormData,
  parser?: Record<string, (value: FormDataEntryValue) => any>
): Record<string, any> => {
  const json: Record<string, string> = {};

  formData.forEach((value, key) => {
    json[key] = parser?.[key] ? parser[key](value) : value;
  });

  return json;
};
