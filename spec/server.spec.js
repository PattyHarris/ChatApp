
// NOTE: this package has been deprecated.
var request = require('request')

describe('calc', () => {
    it('should multiply 2 and 2', () => {
        expect(2*2).toBe(4);
    })
})

describe('get messages', () => {
    it('should return 200 ok', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(res.statusCode).toEqual(200);
            done();
        })
    })
    it('should return a non-empty list', (done) => {
        request.get('http://localhost:3000/messages', (err, res) => {
            expect(JSON.parse(res.body).length).toBeGreaterThan(0);
            done();
        })
    })
})

describe('get messages from user', () => {
    it('should return 200 ok', (done) => {
        request.get('http://localhost:3000/messages/Tim', (err, res) => {
            expect(res.statusCode).toEqual(200);
            done();
        })  
    })
    it('name should be tim', (done) => {
        request.get('http://localhost:3000/messages/Tim', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual('Tim');
            done();
        })  
    })    
})

/*
NOTE: Ideally, there would be a 'before' and 'after' tests which would add a 
message from a 'Tim' and then after tests completion, remove the messages 
for 'Tim'.
*/