const fullName = '(?:(\\w+-?\\w+)) (?:(\\w+))(?: (\\w+))?'
const email =
  "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"

const atleast3 = '.{3,}'
export const RegexPatterns = { fullName, email, atleast3 }
