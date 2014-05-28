var app = require('./dns');

zones = {
  'scottneel.com': {
    records: [
      {
        name: 'test',
        type: 1,
        class: 1,
        ttl: 300,
        data: '192.168.1.2'
      },
      {
        name: 'test',
        type: 1,
        class: 1,
        ttl: 300,
        data: '192.168.1.3'
      },
      {
        name: 'www',
        type: 5, //CNAME
        class: 1,
        ttl: 300,
        data: 'scottneel.com.'
      },
      {
        name: '',
        type: 2, //NS
        class: 1,
        ttl: 300,
        data: 'ns1.scottneel.com.'
      },
      {
        name: 'ns1',
        type: 1,
        class: 1,
        ttl: 300,
        data: '192.168.1.1'
      },
      {
        name: '',
        type: 1, //A
        class: 1,
        ttl: 300,
        data: '192.168.1.4'
      },
      {
        name: '',
        type: 15, //MX
        class: 1,
        ttl: 300,
        data: {
          preference: 10,
          name: 'mx1.scottneel.com.'
        }
      },
      {
        name: '',
        type: 6, //SOA
        class: 1,
        ttl: 300,
        data: {
          primary: 'ns1.scottneel.com.',
          admin: 'admin.scottneel.com.',
          serial: 12312312,
          refresh: 12312312,
          retry: 12312312,
          expiration: 12312312,
          minimum: 12312312
        }
      },
      {
        name: '',
        type: 16, //TXT
        class: 1,
        ttl: 300,
        data: 'testing'
      },
      {
        name: '',
        type: 33, //SRV
        class: 1,
        ttl: 300,
        data: {
          priority: 10,
          weight: 50,
          port: 80,
          target: 'test.scottneel.com.'
        }
      }
    ]
  },
  'test.com': {
    records: [
      {
        name: '',
        type: 1,
        class: 1,
        ttl: 300,
        data: '192.168.1.3'
      }
    ]
  }
};

app.start({
  port: 53535
})
