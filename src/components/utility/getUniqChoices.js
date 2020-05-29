export const GetUniqChoices = (choices) => {
  let uniqNames = [];
  let uniqChoices = [];
  choices.forEach((x) => {
    if (!uniqNames.includes(x.name)) {
      uniqNames.push(x.name);
      uniqChoices.push(x);
    }
  });
  return uniqChoices;
};
