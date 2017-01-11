'use strict';

export default class ObjectIterator
{
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