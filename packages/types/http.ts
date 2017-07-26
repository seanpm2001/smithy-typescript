/**
 * A mapping of header names to string values. Multiple values for the same
 * header should be represented as a single string with values separated by
 * `, `.
 *
 * Keys should be considered case insensitive, even if this is not enforced by a
 * particular implementation. For example, given the following HeaderBag, where
 * keys differ only in case:
 *
 *    {
 *        'x-amz-date': '2000-01-01T00:00:00Z',
 *        'X-Amz-Date': '2001-01-01T00:00:00Z'
 *    }
 *
 * The SDK may at any point during processing remove one of the object
 * properties in favor of the other. The headers may or may not be combined, and
 * the SDK will not deterministically select which header candidate to use.
 */
export interface HeaderBag {
    [key: string]: string;
}

/**
 * Represents an HTTP message with headers and an optional static or streaming
 * body.
 */
export interface HttpMessage<StreamType = Uint8Array> {
    headers: HeaderBag;
    body?: ArrayBuffer|ArrayBufferView|string|StreamType;
}

/**
 * A mapping of query parameter names to strings or arrays of strings, with the
 * latter being used when a parameter contains a list of values.
 */
export interface QueryParameterBag {
    [key: string]: string|Array<string>;
}

export interface HttpEndpoint {
    protocol: string;
    hostname: string;
    port?: number;
    path: string;
    query?: QueryParameterBag;
}

/**
 * Represents an HTTP message constructed to be sent to a host. Contains
 * addressing information in addition to standard message properties.
 */
export interface HttpRequest<StreamType = Uint8Array> extends
    HttpMessage<StreamType>,
    HttpEndpoint
{
    method: string;
}

/**
 * Represents an HTTP message as received in reply to a request. Contains a
 * numeric status code in addition to standard message properties.
 */
export interface HttpResponse<StreamType = Uint8Array> extends
    HttpMessage<StreamType>
{
    statusCode: number;
}

/**
 * A function that takes an HTTP request and returns a promise for an HTTP
 * response.
 *
 * If a `StreamType` type parameter is supplied, both the request and the
 * response may have streaming bodies. In such implementations, the promise
 * returned should resolve as soon as headers are available, and the as-yet
 * uncollected stream should be set as the response's `body` property.
 */
export interface HttpHandler<StreamType = Uint8Array> {
    (request: HttpRequest<StreamType>): Promise<HttpResponse<StreamType>>;
}
