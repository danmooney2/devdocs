/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import mageUtils from "mageUtils";
import events from "uiEvents";
import ContentTypeConfigInterface from "./content-type-config.d";
import ContentTypeInterface from "./content-type.d";
import Master from "./content-type/master";
import Preview from "./content-type/preview";
import DataStore from "./data-store";

export default class ContentType implements ContentTypeInterface {
    public id: string = mageUtils.uniqueid();
    public parent: ContentTypeInterface;
    public stageId: string;
    public config: ContentTypeConfigInterface;
    public data = {};
    public wrapperStyle: KnockoutObservable<object> = ko.observable({width: "100%"});
    public element: JQuery<HTMLElement>;
    public dataStore: DataStore = new DataStore();
    public preview: Preview;
    public content: Master;

    /**
     * @param {ContentTypeInterface} parent
     * @param {ContentTypeConfigInterface} config
     * @param {string} stageId
     */
    constructor(
        parent: ContentTypeInterface,
        config: ContentTypeConfigInterface,
        stageId: string,
    ) {
        this.parent = parent;
        this.config = config;
        this.stageId = stageId;
        this.bindEvents();
    }

    protected bindEvents() {
        const eventName: string = this.config.name + ":" + this.id + ":updateAfter";
        const paramObj: any = {};
        paramObj[this.id] = this;
        this.dataStore.subscribe(
            () => events.trigger(
                eventName,
                paramObj,
            ),
        );

        this.dataStore.subscribe(
            () => events.trigger(
                "stage:updateAfter",
                {stageId: this.stageId},
            ),
        );
    }
}
