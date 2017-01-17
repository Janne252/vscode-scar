'use strict';

export interface IAutoUpdater
{
    /**
     * Whether or not the update should be ran.
     */
    shouldUpdate: boolean;
    /**
     * How often shouldUpdate is checked.
     */
    interval: number;
    /**
     * Enable auto update.
     */
    start(): void;
    /**
     * Disable auto update.
     */
    stop(): void;

    handler: IAutoUpdateCallback;
}

export interface IAutoUpdateCallback
{
    (): void;
}

export default class AutoUpdater implements IAutoUpdater
{
    /**
     * Internal handle for keeping track of the auto update interval.
     */
    protected autoUpdateHandle: NodeJS.Timer;
    /**
     * Whether or not the update should be ran.
     */
    public shouldUpdate: boolean;
    /**
     * How often shouldUpdate is checked.
     */
    public interval: number;

    public handler: IAutoUpdateCallback;
    /**
     * Creates a new instance of AutoUpdatingBase
     * @param updateInteval How often shouldUpdate is checked.
     */
    constructor(handler: IAutoUpdateCallback, updateInterval: number = 1000)
    {
        this.shouldUpdate = false;
        this.interval = updateInterval;
        this.handler = handler;
    }
    /**
     * Enable auto update.
     */
    public start(): void
    {
        if (this.autoUpdateHandle === undefined)
        {
            this.autoUpdateHandle = setInterval(() =>
            {
                if (this.shouldUpdate && this.handler !== undefined)
                {
                    this.handler();
                }

                this.shouldUpdate = false;
            }, this.interval);
        }
    }
    /**
     * Disable auto update.
     */
    public stop(): void
    {
        if (this.autoUpdateHandle !== undefined)
        {
            clearInterval(this.autoUpdateHandle);
        }
    }
}
