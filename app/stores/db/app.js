export default function() {
  return {
    name: 'App',
    properties: {
      token: 'string',
      name: 'string',
      email: 'string',
      lastLoginDate: 'date',
      validDate: 'date',
      isPasswordChangedRequired: 'bool'
    }
  };
}
