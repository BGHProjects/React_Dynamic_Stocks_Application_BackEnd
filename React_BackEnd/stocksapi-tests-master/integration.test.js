/**
 * Install dependencies before you attempt to run the tests!!
 * ****** run npm i in termnal, under this directory *****
 * Start your server before running the test
 * run npm test when you are ready
 * A report will be automatically generated under this directory
 */
const axios = require('axios')
const uuid = require('uuid/v4')
const to = require('./lib/to')
const https = require('https')


//If you are serving your server on any port other than 3000, change the port here, or alternatively change the url to approriate 
//const REMOTE_API_URL = `http://localhost:3000`
const REMOTE_API_URL = `https://172.22.25.181:443`;
const EMAIL = `${uuid()}@fake-email.com`
const PASSWORD = 'webcomputing'
let TOKEN = ''

https.globalAgent.options.rejectUnauthorized = false;
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  })
});

describe('stock symbols', () => {

  describe('with invalid query parameter', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/symbols?name=a`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 400', () => expect(response.status).toBe(400))
    test('should return status text - Bad Request', () => expect(response.statusText).toBe('Bad Request'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with false industry', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/symbols?industry=an_industry_that_doesn't exist`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 404', () => expect(response.status).toBe(404))
    test('should return status text - Not Found', () => expect(response.statusText).toBe('Not Found'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with no parameter', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/symbols`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 200', () => expect(response.status).toBe(200))
    test('should return status OK', () => expect(response.statusText).toBe('OK'))
    test('should contain correct first name property', () => expect(response.data[0].name).toBe("Agilent Technologies Inc"))
    test('should contain correct first symbol property', () => expect(response.data[0].symbol).toBe("A"))
    test('should contain correct first industry property', () => expect(response.data[0].industry).toBe("Health Care"))

  })

  describe('with valid query parameter', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/symbols?industry=d`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 200', () => expect(response.status).toBe(200))
    test('should return status OK', () => expect(response.statusText).toBe('OK'))
    test('should contain correct first name property', () => expect(response.data[0].name).toBe("American Airlines Group"))
    test('should contain correct first symbol property', () => expect(response.data[0].symbol).toBe("AAL"))
    test('should contain correct first industry property', () => expect(response.data[0].industry).toBe("Industrials"))

  })

})

describe('specific stocks', () => {

  describe('with invalid query parameters', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/AAL?from=2020-03-13T00:00:00.000Z&to=2020-03-20T00:00:00.000Z`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 400', () => expect(response.status).toBe(400))
    test('should return status text - Bad Request', () => expect(response.statusText).toBe('Bad Request'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with unknown stock symbol', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/AALA`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 404', () => expect(response.status).toBe(404))
    test('should return status text - Not Found', () => expect(response.statusText).toBe('Not Found'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with a correctly formatted parameter', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/AAL`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 200', () => expect(response.status).toBe(200))
    test('should return status OK', () => expect(response.statusText).toBe('OK'))
    test('should contain correct name property', () => expect(response.data.name).toBe("American Airlines Group"))
    test('should contain correct symbol property', () => expect(response.data.symbol).toBe("AAL"))
    test('should contain correct industry property', () => expect(response.data.industry).toBe("Industrials"))
    test('should contain correct timestamp property', () => expect(response.data.timestamp).toBe("2020-03-23T14:00:00.000Z"))
    test('should contain correct open property', () => expect(response.data.open).toBe(10.9))
    test('should contain correct high property', () => expect(response.data.high).toBe(11.36))
    test('should contain correct low property', () => expect(response.data.low).toBe(10.01))
    test('should contain correct close property', () => expect(response.data.close).toBe(10.25))
    test('should contain correct volumes property', () => expect(response.data.volumes).toBe(55494100))

  })
})

describe('user', () => {
  describe('registration', () => {
    describe('with missing email', () => {
      beforeAll(async () => {
        const request = await to.object(instance.post(`${REMOTE_API_URL}/user/register`, { password: PASSWORD }))
        return response = request.resolve ? request.resolve : request.reject.response
      })
      test('should return status code 400', () => expect(response.status).toBe(400))
      test('should return status text - Bad Request', () => expect(response.statusText).toBe('Bad Request'))
      test('should contain message property', () => expect(response.data).toHaveProperty('message'))
    })

    describe('with missing password', () => {
      beforeAll(async () => {
        const request = await to.object(instance.post(`${REMOTE_API_URL}/user/register`, { email: EMAIL }))
        return response = request.resolve ? request.resolve : request.reject.response
      })
      test('should return status code 400', () => expect(response.status).toBe(400))
      test('should return status text - Bad Request', () => expect(response.statusText).toBe('Bad Request'))
      test('should contain message property', () => expect(response.data).toHaveProperty('message'))
    })

    describe('with missing email and password', () => {
      beforeAll(async () => {
        const request = await to.object(instance.post(`${REMOTE_API_URL}/user/register`, {}))
        return response = request.resolve ? request.resolve : request.reject.response
      })
      test('should return status code 400', () => expect(response.status).toBe(400))
      test('should return status text - Bad Request', () => expect(response.statusText).toBe('Bad Request'))
      test('should contain message property', () => expect(response.data).toHaveProperty('message'))
    })

    describe('with valid email and password', () => {
      beforeAll(async () => {
        const request = await to.object(instance.post(`${REMOTE_API_URL}/user/register`, { email: EMAIL, password: PASSWORD }))
        return response = request.resolve ? request.resolve : request.reject.response
      })

      test('should return status code 201', () => expect(response.status).toBe(201))
      test('should return status text - Created', () => expect(response.statusText).toBe('Created'))
      test('should contain message property', () => expect(response.data).toHaveProperty('message'))
    })
  })
})

describe('login', () => {
  describe('with missing email', () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`${REMOTE_API_URL}/user/login`, { password: PASSWORD }))
      return response = request.resolve ? request.resolve : request.reject.response
    })
    test('should return status code 400', () => expect(response.status).toBe(400))
    test('should return status text - Created', () => expect(response.statusText).toBe('Bad Request'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with missing password', () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`${REMOTE_API_URL}/user/login`, { email: EMAIL }))
      return response = request.resolve ? request.resolve : request.reject.response
    })
    test('should return status code 400', () => expect(response.status).toBe(400))
    test('should return status text - Created', () => expect(response.statusText).toBe('Bad Request'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with non-existing user (email)', () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`${REMOTE_API_URL}/user/login`, { email: `${uuid()}@fake-email.com`, password: PASSWORD }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 401', () => expect(response.status).toBe(401))
    test('should return status text - Created', () => expect(response.statusText).toBe('Unauthorized'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with invalid password', () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`${REMOTE_API_URL}/user/login`, { email: EMAIL, password: 'PASSWORD' }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 401', () => expect(response.status).toBe(401))
    test('should return status text - Created', () => expect(response.statusText).toBe('Unauthorized'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with valid email and password', () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`${REMOTE_API_URL}/user/login`, { email: EMAIL, password: PASSWORD }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 200', () => expect(response.status).toBe(200))
    test('should return status text - OK', () => expect(response.statusText).toBe('OK'))
    test('should contain token property', () => expect(response.data).toHaveProperty('token'))
    test('should contain token_type property', () => expect(response.data).toHaveProperty('token_type'))
    test('should contain expires_in property', () => expect(response.data).toHaveProperty('expires_in'))
    test('should contain correct token_type', () => expect(response.data.token_type).toBe(`Bearer`))
    test('should contain correct expires_in', () => expect(response.data.expires_in).toBe(86400))
  })
})

describe('authorised route', () => {
  beforeAll(async () => {
    const login = await axios.post(`${REMOTE_API_URL}/user/login`, {
      email: EMAIL,
      password: PASSWORD
    })
    TOKEN = login.data.token
  })
  describe('with invalid paramaters/data format', () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/authed/AAL?begin=2020-03-15T00%3A00%3A00.000Z&until=2020-03-20T00%3A00%3A00.000Z`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 400', () => expect(response.status).toBe(400))
    test('should return status text - Bad Request', () => expect(response.statusText).toBe('Bad Request'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with no authorisation header', () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/authed/AAL?from=2020-03-15T00%3A00%3A00.000Z&until=2020-03-20T00%3A00%3A00.000Z`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 403', () => expect(response.status).toBe(403))
    test('should return status text - Forbidden', () => expect(response.statusText).toBe('Forbidden'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with out of bounds dates', () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/authed/AAL?from=2020-04-15T00%3A00%3A00.000Z&to=2020-05-20T00%3A00%3A00.000Z`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 404', () => expect(response.status).toBe(404))
    test('should return status text - Not Found', () => expect(response.statusText).toBe('Not Found'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with correctly formated query and authorization header', () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/authed/AAL?from=2020-03-15T00%3A00%3A00.000Z&to=2020-03-20T00%3A00%3A00.000Z`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 200', () => expect(response.status).toBe(200))
    test('should return status text - OK', () => expect(response.statusText).toBe('OK'))
    test('should contain correct -to- date', () => expect(response.data[0].timestamp).toBe(`2020-03-19T14:00:00.000Z`))
    test('should contain correct -to- symbol', () => expect(response.data[0].symbol).toBe('AAL'))
    test('should contain correct -to- name property', () => expect(response.data[0].name).toBe("American Airlines Group"))
    test('should contain correct -to- industry property', () => expect(response.data[0].industry).toBe("Industrials"))
    test('should contain correct -to- open property', () => expect(response.data[0].open).toBe(11.6))
    test('should contain correct -to- high property', () => expect(response.data[0].high).toBe(12.16))
    test('should contain correct -to- low property', () => expect(response.data[0].low).toBe(10.01))
    test('should contain correct -to- close property', () => expect(response.data[0].close).toBe(10.29))
    test('should contain correct -to- volumes property', () => expect(response.data[0].volumes).toBe(71584500))
    test('should contain correct -from- date', () => expect(response.data[response.data.length - 1].timestamp).toBe(`2020-03-15T14:00:00.000Z`))
    test('should contain correct -from- symbol', () => expect(response.data[response.data.length - 1].symbol).toBe('AAL'))
    test('should contain correct -from- name property', () => expect(response.data[response.data.length - 1].name).toBe("American Airlines Group"))
    test('should contain correct -from- industry property', () => expect(response.data[response.data.length - 1].industry).toBe("Industrials"))
    test('should contain correct -from- open property', () => expect(response.data[response.data.length - 1].open).toBe(15.3))
    test('should contain correct -from- high property', () => expect(response.data[response.data.length - 1].high).toBe(15.6))
    test('should contain correct -from- low property', () => expect(response.data[response.data.length - 1].low).toBe(13.12))
    test('should contain correct -from- close property', () => expect(response.data[response.data.length - 1].close).toBe(14.31))
    test('should contain correct -from- volumes property', () => expect(response.data[response.data.length - 1].volumes).toBe(58376100))
  })
})
