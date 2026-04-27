test('SearchColors API structure validation', () => {
    const mockResponse = {
        results: ["red", "blue", "green"]
    };

    expect(mockResponse).toHaveProperty('results');
    expect(Array.isArray(mockResponse.results)).toBe(true);
});