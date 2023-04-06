import notifyInterestHandler from '../../../pages/api/notify_interest';

describe('notifyInterestHandler', () => {
  // Use mockResolvedValueOnce for each test case
  const mockProducerResponse = { status: 200, json: jest.fn().mockResolvedValueOnce({ success: true }) };
  const mockFetch = jest.fn().mockResolvedValueOnce(mockProducerResponse);

  const mockRequest = { body: { file_path: './CityInfo/citysimulator/data_files/file.pdf' } };
  const mockResponse = {
    status: jest.fn(),
    json: jest.fn()
  };

  // Use describe blocks to group related tests
  describe('when the producer responds with success', () => {
    // Use expect.assertions(number) to verify the number of assertions
    test('returns a successful response', async () => {
      expect.assertions(3);

      // Use await or .then() when calling asynchronous functions
      await notifyInterestHandler(mockRequest, mockResponse, mockFetch);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/notify_interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file_path: '/home/couto/Desktop/CityInfo/citysimulator/data_files/file.pdf' })
      });

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    });
  });

  // Add more describe blocks for different input data and producer responses
});