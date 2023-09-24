const makeId = async (length: number): Promise<string> => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const uniqueId = () => {
  Date.now().toString(32) + Math.random().toString(32).substring(2);
};

export { uniqueId, makeId };
