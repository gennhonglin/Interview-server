const request = require('supertest');
const app = require('./index');

describe('POST /submit', () => {
  it('should save form data and return success message', async () => {
      const response = await request(app)
          .post('/submit')
          .send({
              fName: 'John',
              lName: 'Doe',
              number: '1234567890',
              email: 'john.doe@example.com',
          });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Data saved successfully!");
  });

  it('should return error for invalid phone number', async () => {
      const response = await request(app)
          .post('/submit')
          .send({
              fName: 'John',
              lName: 'Doe',
              number: 'invalid-phone',
              email: 'john.doe@example.com',
          });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please enter a valid phone number");
  });

  it('should return error for invalid email', async () => {
      const response = await request(app)
          .post('/submit')
          .send({
              fName: 'John',
              lName: 'Doe',
              number: '1234567890',
              email: 'invalid-email',
          });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid Email Format");
  });

  it('should return error for missing required fields', async () => {
    const response = await request(app)
        .post('/submit')
        .send({
          number: '1234567890',
          email: 'john.doe@example.com',
        });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing required fields");
  });
});