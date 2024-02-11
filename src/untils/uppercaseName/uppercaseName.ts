const upperCaseName = (name: string) => {
  const words = name.split(' ');

  const change = words.map((e) => {
    return e.charAt(0).toUpperCase() + e.slice(1).toLowerCase();
  });

  return change.join(' ');
};

export { upperCaseName };
