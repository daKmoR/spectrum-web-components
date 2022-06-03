/* STORIES
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import {
    html,
    SpectrumElement,
    TemplateResult,
} from '@spectrum-web-components/base';
import { property } from '@spectrum-web-components/base/src/decorators.js';

import '../sp-table.js';
import '../sp-table-checkbox-cell.js';
import '../sp-table-head.js';
import '../sp-table-head-cell.js';
import '../sp-table-body.js';
import '../sp-table-row.js';
import '../sp-table-cell.js';
import type { SortedEventDetails } from '../src/TableHeadCell.js';
import { Table } from '../src/Table.js';

export default {
    title: 'Table',
    component: 'sp-table',
};

export const elements = (): TemplateResult => {
    return html`
        <sp-table size="m">
            <sp-table-head>
                <sp-table-head-cell sortable sorted="desc">
                    Column Title
                </sp-table-head-cell>
                <sp-table-head-cell sortable>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
            </sp-table-head>
            <sp-table-body style="height: 120px">
                <sp-table-row>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                </sp-table-row>
                <sp-table-row>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                </sp-table-row>
                <sp-table-row>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                </sp-table-row>
                <sp-table-row>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                </sp-table-row>
                <sp-table-row>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                </sp-table-row>
            </sp-table-body>
        </sp-table>
    `;
};

function makeItems(count: number): {
    name: string;
    date: number;
}[] {
    const total = count;
    const items: {
        name: string;
        date: number;
    }[] = [];
    while (count) {
        count--;
        items.push({
            name: String(total - count),
            date: count,
        });
    }
    return items;
}

class VirtualTable extends SpectrumElement {
    @property({ type: Array })
    public items: {
        name: string;
        date: number;
    }[] = makeItems(50);

    constructor() {
        super();
        this.items.sort(this.sortItems('name', 'desc'));
    }

    sortItems =
        (sortBy: 'name' | 'date', sorted: 'asc' | 'desc') =>
        (
            a: {
                name: string;
                date: number;
            },
            b: {
                name: string;
                date: number;
            }
        ): number => {
            const doSortBy = sortBy;
            if (!isNaN(Number(a[doSortBy]))) {
                const first = Number(a[doSortBy]);
                const second = Number(b[doSortBy]);
                return sorted === 'asc' ? first - second : second - first;
            } else {
                const first = String(a[doSortBy]);
                const second = String(b[doSortBy]);
                return sorted === 'asc'
                    ? first.localeCompare(second)
                    : second.localeCompare(first);
            }
        };

    renderItem = (item: Item, index: number): TemplateResult => {
        return html`
            <sp-table-cell>Row Item Alpha ${item.name}</sp-table-cell>
            <sp-table-cell>Row Item Alpha ${item.date}</sp-table-cell>
            <sp-table-cell>Row Item Alpha ${index}</sp-table-cell>
        `;
    };

    protected override render(): TemplateResult {
        return html`
            <sp-table
                aria-rowcount="50"
                size="m"
                @sorted=${(event: CustomEvent<SortedEventDetails>): void => {
                    // const { sortby, sorted } = event.target; // sources the target, doesn't work across shadow boundaries
                    const { sortBy, sorted } = event.detail; // leveraged CustomEvent().detail, works across shadow boundaries
                    // const { sortby, sorted } = event; // class extension of of the Event constructor

                    const items = [...this.items];
                    // depending on the column, sort asc or desc depending on the arrow direction
                    items.sort(
                        this.sortItems(sortBy as 'name' | 'date', sorted)
                    );
                    this.items = items;

                    // const items = [...this.items];
                    // this.items = items.reverse();
                }}
            >
                <sp-table-head>
                    <sp-table-head-cell sortable sortby="name" sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable sortby="date">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
                <sp-table-body
                    style="height: 120px"
                    .items=${this.items}
                    .renderItem=${this.renderItem}
                    scroller?="true"
                ></sp-table-body>
            </sp-table>
        `;
    } // .itemValue=${(item) => {return item.name}} <-- but this in sptablebody
}

customElements.define('virtual-table', VirtualTable);

export const virtualized = (): TemplateResult => {
    return html`
        <virtual-table></virtual-table>
    `;
};

interface Item extends Record<string, unknown> {
    name: string;
    date: number;
}

function makeItemsTwo(count: number): Item[] {
    const total = count;
    const items: Item[] = [];
    while (count) {
        count--;
        items.push({
            name: String(total - count),
            date: count,
        });
    }
    return items;
}

export const virtualizedTwo = (): TemplateResult => {
    const virtualItems = makeItemsTwo(50);

    const renderItem = (item: Item, index: number): TemplateResult => {
        return html`
            <sp-table-cell>Row Item Alpha ${item.name}</sp-table-cell>
            <sp-table-cell>Row Item Alpha ${item.date}</sp-table-cell>
            <sp-table-cell>Row Item Alpha ${index}</sp-table-cell>
        `;
    };

    const sortItems =
        (sortBy: 'name' | 'date', sorted: 'asc' | 'desc') =>
        (a: Item, b: Item): number => {
            const doSortBy = sortBy;
            if (!isNaN(Number(a[doSortBy]))) {
                const first = Number(a[doSortBy]);
                const second = Number(b[doSortBy]);
                return sorted === 'asc' ? first - second : second - first;
            } else {
                const first = String(a[doSortBy]);
                const second = String(b[doSortBy]);
                return sorted === 'asc'
                    ? first.localeCompare(second)
                    : second.localeCompare(first);
            }
        };

    return html`
        <sp-table
            size="m"
            @sorted=${(event: CustomEvent<SortedEventDetails>): void => {
                const { sortBy, sorted } = event.detail; // leveraged CustomEvent().detail, works across shadow boundaries
                const items = virtualItems;
                // depending on the column, sort asc or desc depending on the arrow direction
                items.sort(sortItems(sortBy as 'name' | 'date', sorted));
            }}
        >
            <sp-table-head>
                <sp-table-head-cell sortable sortby="name" sorted="desc">
                    Column Title
                </sp-table-head-cell>
                <sp-table-head-cell sortable sortby="date">
                    Column Title
                </sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
            </sp-table-head>
            <sp-table-body
                style="height: 120px"
                .items=${virtualItems}
                .renderItem=${renderItem}
                scroller?="true"
            ></sp-table-body>
        </sp-table>
    `;
};

export const selectsSingle = (): TemplateResult => {
    return html`
        <sp-table
            size="m"
            selects="single"
            .selected=${['row1']}
            @change=${({ target }: Event & { target: Table }) => {
                const next = target.nextElementSibling as HTMLDivElement;
                next.textContent = `Selected: ${JSON.stringify(
                    target.selected
                )}`;
            }}
        >
            <sp-table-head>
                <sp-table-head-cell sortable sorted="desc">
                    Column Title
                </sp-table-head-cell>
                <sp-table-head-cell sortable>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
            </sp-table-head>
            <sp-table-body style="height: 120px">
                <sp-table-row value="row1">
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row2">
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row3">
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row4">
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row5">
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                </sp-table-row>
            </sp-table-body>
        </sp-table>
        <div>Selected: ["row1"]</div>
    `;
};
export const selectsSingleWeird = (): TemplateResult => {
    return html`
        <sp-table size="m" .selected=${['row1', 'row2']}>
            <sp-table-head>
                <sp-table-head-cell sortable sorted="desc">
                    Column Title
                </sp-table-head-cell>
                <sp-table-head-cell sortable>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
            </sp-table-head>
            <sp-table-body style="height: 120px">
                <sp-table-row value="row1">
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row2">
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row3">
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row4">
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row5">
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                </sp-table-row>
            </sp-table-body>
        </sp-table>
    `;
};

export const selectsMultiple = (): TemplateResult => {
    return html`
        <sp-table
            size="m"
            selects="multiple"
            .selected=${['row1', 'row2']}
            @change=${({ target }: Event & { target: Table }) => {
                const next = target.nextElementSibling as HTMLDivElement;
                next.textContent = `Selected: ${JSON.stringify(
                    target.selected
                )}`;
            }}
        >
            <sp-table-head>
                <sp-table-head-cell sortable sorted="desc">
                    Column Title
                </sp-table-head-cell>
                <sp-table-head-cell sortable>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
            </sp-table-head>
            <sp-table-body style="height: 120px">
                <sp-table-row value="row1">
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row2">
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row3">
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row4">
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row5">
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                </sp-table-row>
            </sp-table-body>
        </sp-table>
        <div>Selected: ["row1", "row2"]</div>
    `;
};

export const selectsMultipleAttributes = (): TemplateResult => {
    return html`
        <sp-table size="m" selects="multiple">
            <sp-table-head>
                <sp-table-head-cell sortable sorted="desc">
                    Column Title
                </sp-table-head-cell>
                <sp-table-head-cell sortable>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
            </sp-table-head>
            <sp-table-body style="height: 120px">
                <sp-table-row value="row1" selected>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                    <sp-table-cell>Row Item Alpha</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row2">
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                    <sp-table-cell>Row Item Bravo</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row3" selected>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                    <sp-table-cell>Row Item Charlie</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row4">
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                    <sp-table-cell>Row Item Delta</sp-table-cell>
                </sp-table-row>
                <sp-table-row value="row5">
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                    <sp-table-cell>Row Item Echo</sp-table-cell>
                </sp-table-row>
            </sp-table-body>
        </sp-table>
    `;
};
