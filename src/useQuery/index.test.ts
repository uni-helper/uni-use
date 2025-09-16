import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { tryParseJson, useQuery } from './index';

describe('useQuery', () => {
  it('should export the useQuery function', () => {
    expect(typeof useQuery).toBe('function');
  });

  it('should return query and value refs', () => {
    const result = useQuery();

    expect(result).toHaveProperty('query');
    expect(result).toHaveProperty('value');
    expect(result.query).toBeDefined();
    expect(result.value).toBeDefined();
  });

  it('should work with key parameter', () => {
    const result = useQuery('testKey');

    expect(result).toHaveProperty('query');
    expect(result).toHaveProperty('value');
  });

  it('should work with reactive key', () => {
    const key = ref('id');
    const result = useQuery(key);

    expect(result).toHaveProperty('query');
    expect(result).toHaveProperty('value');
  });

  it('should work with options parameter', () => {
    const result = useQuery(undefined, { parseJson: false });

    expect(result).toHaveProperty('query');
    expect(result).toHaveProperty('value');
  });

  it('should work with both key and options', () => {
    const result = useQuery('testKey', { parseJson: true });

    expect(result).toHaveProperty('query');
    expect(result).toHaveProperty('value');
  });
});

describe('json parsing logic', () => {
  it('should parse simple JSON object', () => {
    const jsonString = '{"id":123,"name":"test"}';
    const result = tryParseJson(jsonString);
    expect(result).toEqual({ id: 123, name: 'test' });
  });

  it('should parse JSON array', () => {
    const jsonString = '[1,2,3]';
    const result = tryParseJson(jsonString);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should parse URL encoded JSON', () => {
    const data = { id: 123, name: 'coal', type: 'blending' };
    const encoded = encodeURIComponent(JSON.stringify(data));
    const result = tryParseJson(encoded);
    expect(result).toEqual(data);
  });

  it('should handle complex nested objects', () => {
    const data = {
      id: 123,
      details: {
        type: 'coal-blending',
        specs: { amount: 50, quality: 'high' },
      },
      tags: ['coal', 'energy', 'industrial'],
    };
    const jsonString = JSON.stringify(data);
    const result = tryParseJson(jsonString);
    expect(result).toEqual(data);
  });

  it('should return original string for non-JSON', () => {
    const normalString = 'hello world';
    const result = tryParseJson(normalString);
    expect(result).toBe(normalString);
  });

  it('should return original value for non-string', () => {
    const numberValue = 123;
    const result = tryParseJson(numberValue);
    expect(result).toBe(numberValue);
  });

  it('should handle malformed JSON gracefully', () => {
    const malformedJson = '{"id":123,"name"';
    const result = tryParseJson(malformedJson);
    expect(result).toBe(malformedJson);
  });

  it('should handle JSON with special characters', () => {
    const data = {
      message: 'Hello "world"!',
      path: '/path/to/file',
      symbols: '!@#$%^&*()',
    };
    const jsonString = JSON.stringify(data);
    const result = tryParseJson(jsonString);
    expect(result).toEqual(data);
  });

  it('should trim whitespace before parsing', () => {
    const jsonString = '  {"id":123}  ';
    const result = tryParseJson(jsonString);
    expect(result).toEqual({ id: 123 });
  });

  it('should handle empty strings', () => {
    const result = tryParseJson('');
    expect(result).toBe('');
  });
});
