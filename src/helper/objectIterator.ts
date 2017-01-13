'use strict';

/**
 * Represents an iterator for objects.
 */
export default class ObjectIterator
{
	/**
	 * Iterates over all keys and values of an object. Passes everything to the callback, including null values.
	 * @param obj The object to iterate over.
	 * @param callback The callback used to pass the key and value pairs of the object.
	 */
	public static each(obj: Object, callback: (key: any, value:any) => void)
	{
		for(let k in obj)
		{
			callback(k, obj[k]);

			if (typeof obj[k] === 'object')
			{
				ObjectIterator.each(obj[k], callback);
			}
		}
	}
}