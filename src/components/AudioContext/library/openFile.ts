export const openFile = (
  accept?: string,
  multiple?: boolean
): Promise<File[]> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept ?? '*';
    input.multiple = multiple ?? false;

    input.onchange = () => {
      resolve([...input.files ?? []]);
      input.remove();
    };

    input.click();
  });
};