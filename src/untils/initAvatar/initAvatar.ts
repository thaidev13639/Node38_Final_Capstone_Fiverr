const innitAvatar = (full_name: string) => {
  let name = full_name.toUpperCase().split(' ');
  console.log(name);
  if (name.length === 1) {
    return `https://ui-avatars.com/api/?name=${name[0][0]}&background=random&size=100`;
  }
  let newAvatar = name[0][0] + name[name.length - 1][0];
  return `https://ui-avatars.com/api/?name=${newAvatar}&background=random&size=100`;
};

export { innitAvatar };
