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
import {
    Item,
    makeItems,
    makeItemsTwo,
    Properties,
    renderItem,
} from './index.js';
import type { SortedEventDetails } from '../src/TableHeadCell.js';
import { RangeChangedEvent, Table } from '../src/Table.js';

export default {
    title: 'Table/Virtualized',
    component: 'sp-table',
    argTypes: {
        onChange: { action: 'change' },
        selected: {
            name: 'selected',
            description: 'The array of item values selected by the Table.',
            type: { name: '', required: false },
            control: 'text',
        },
        selects: {
            name: 'selects',
            description:
                'If the Table accepts a "single" or "multiple" selection.',
            control: {
                type: 'inline-radio',
                options: ['', 'single', 'multiple'],
            },
        },
    },
    args: {
        selects: '',
    },
};

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

    protected override render(): TemplateResult {
        return html`
            <sp-table
                aria-rowcount="50"
                .items=${this.items}
                .renderItem=${renderItem}
                style="height: 200px"
                size="m"
                @sorted=${(event: CustomEvent<SortedEventDetails>): void => {
                    const { sortBy, sorted } = event.detail; // leveraged CustomEvent().detail, works across shadow boundaries
                    const items = [...this.items];
                    // depending on the column, sort asc or desc depending on the arrow direction
                    items.sort(
                        this.sortItems(sortBy as 'name' | 'date', sorted)
                    );
                    this.items = items;
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
            </sp-table>
        `;
    }
}

customElements.define('virtual-table', VirtualTable);

export const virtualized = (): TemplateResult => {
    return html`
        <virtual-table></virtual-table>
    `;
};

export const virtualizedSingle = (args: Properties): TemplateResult => {
    const virtualItems = makeItemsTwo(50);

    const onChange =
        (args.onChange as (eventData: {
            first: number;
            last: number;
            type: string;
        }) => void) ||
        (() => {
            return;
        });

    return html`
        <sp-table
            size="m"
            selects=${args.selects}
            .selected=${['0']}
            @change=${({ target }: Event & { target: Table }) => {
                const next = target.nextElementSibling as HTMLDivElement;
                next.textContent = `Selected: ${JSON.stringify(
                    target.selected
                )}`;
            }}
            style="height: 200px"
            .items=${virtualItems}
            .renderItem=${renderItem}
            @visibilityChanged=${(event: RangeChangedEvent) =>
                onChange({
                    first: event.first,
                    last: event.last,
                    type: 'visibility',
                })}
            @rangeChanged=${(event: RangeChangedEvent) =>
                onChange({
                    first: event.first,
                    last: event.last,
                    type: 'range',
                })}
        >
            <sp-table-head>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
            </sp-table-head>
        </sp-table>
        <div>Selected: ["0"]</div>
    `;
};
virtualizedSingle.args = {
    selects: 'single',
};

export const virtualizedMultiple = (args: Properties): TemplateResult => {
    const virtualItems = makeItemsTwo(50);

    const renderItem = (item: Item, index: number): TemplateResult => {
        return html`
            <sp-table-cell>Rowsaa Item Alpha ${item.name}</sp-table-cell>
            <sp-table-cell>Row Item Alpha ${item.date}</sp-table-cell>
            <sp-table-cell>Row Item Alpha ${index}</sp-table-cell>
        `;
    };

    return html`
        <sp-table
            size="m"
            selects=${args.selects}
            .selected=${['0', '48']}
            @change=${({ target }: Event & { target: Table }) => {
                const next = target.nextElementSibling as HTMLDivElement;
                next.textContent = `Selected: ${JSON.stringify(
                    target.selected,
                    null,
                    ' '
                )}`;
                const nextNext = next.nextElementSibling as HTMLDivElement;
                nextNext.textContent = `Selected Count: ${target.selected.length}`;
            }}
            style="height: 200px"
            .items=${virtualItems}
            .renderItem=${renderItem}
        >
            <sp-table-head>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
            </sp-table-head>
        </sp-table>
        <div>Selected: ["0", "48"]</div>
        <div>Selected Count: 2</div>
    `;
};
virtualizedMultiple.args = {
    selects: 'multiple',
};

export const virtualizedCustomValue = (args: Properties): TemplateResult => {
    const virtualItems = makeItemsTwo(50);

    return html`
        <sp-table
            size="m"
            selects=${args.selects}
            .selected=${['0', '48', 'applied-47']}
            @change=${({ target }: Event & { target: Table }) => {
                const next = target.nextElementSibling as HTMLDivElement;
                next.textContent = `Selected: ${JSON.stringify(
                    target.selected,
                    null,
                    ' '
                )}`;
                const nextNext = next.nextElementSibling as HTMLDivElement;
                nextNext.textContent = `Selected Count: ${target.selected.length}`;
            }}
            .items=${virtualItems}
            .itemValue=${(item: Item) => 'applied-' + item.date}
            .renderItem=${renderItem}
        >
            <sp-table-head>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
                <sp-table-head-cell>Column Title</sp-table-head-cell>
            </sp-table-head>
            <sp-table-body style="height: 120px" scroller></sp-table-body>
        </sp-table>
        <div>Selected: ["0", "48", "applied-47"]</div>
        <div>Selected Count: 2</div>
    `;
};
virtualizedCustomValue.args = {
    selects: 'multiple',
};
