/*
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
    elementUpdated,
    expect,
    fixture,
    html,
    nextFrame,
    oneEvent,
} from '@open-wc/testing';

import '../sp-table.js';
import '../sp-table-head.js';
import '../sp-table-head-cell.js';
import '../sp-table-body.js';
import '../sp-table-row.js';
import '../sp-table-cell.js';
import { Table } from '../';
import {
    elements,
    selectsMultiple,
    selectsSingle,
} from '../stories/table-elements.stories.js';
import {
    virtualized,
    virtualizedCustomValue,
    virtualizedMultiple,
    virtualizedSingle,
} from '../stories/table-virtualized.stories.js';
import { Item, makeItemsTwo, Properties } from '../stories/index.js';
import { TableHeadCell } from '../src/TableHeadCell.js';
import { sendKeys } from '@web/test-runner-commands';
import { TableRow } from '../src/TableRow.js';
import { spy } from 'sinon';
import { TableCheckboxCell } from '../src/TableCheckboxCell.js';
import { TemplateResult } from '@spectrum-web-components/base';

let globalErrorHandler: undefined | OnErrorEventHandler = undefined;
before(function () {
    // Save Mocha's handler.
    (
        Mocha as unknown as { process: { removeListener(name: string): void } }
    ).process.removeListener('uncaughtException');
    globalErrorHandler = window.onerror;
    addEventListener('error', (error) => {
        if (error.message?.match?.(/ResizeObserver loop limit exceeded/)) {
            return;
        } else {
            globalErrorHandler?.(error);
        }
    });
});
after(function () {
    window.onerror = globalErrorHandler as OnErrorEventHandler;
});

const renderItem = (item: Item, index: number): TemplateResult => {
    return html`
        <sp-table-cell>Rowsa Item Alpha ${item.name}</sp-table-cell>
        <sp-table-cell>Row Item Alpha ${item.date}</sp-table-cell>
        <sp-table-cell>Row Item Alpha ${index}</sp-table-cell>
    `;
};

describe('Table', () => {
    it('loads default table accessibly', async () => {
        const el = await fixture<Table>(elements());
        await expect(el).to.be.accessible();
    });

    it('loads virtualized table accessibly', async () => {
        const el = await fixture<Table>(virtualized());
        await expect(el).to.be.accessible();
    });

    it('creates tab stops for `<sp-table-head-cell sortable>`', async () => {
        const input = document.createElement('input');
        const test = await fixture<HTMLElement>(virtualized());
        const el = test.shadowRoot?.querySelector('sp-table') as Table;

        test.insertAdjacentElement('beforebegin', input);

        input.focus();
        expect(input === document.activeElement).to.be.true;

        const firstSortable = el.querySelector(
            '[sortable]:nth-of-type(1)'
        ) as TableHeadCell;
        const secondSortable = el.querySelector(
            '[sortable]:nth-of-type(2)'
        ) as TableHeadCell;

        await sendKeys({
            press: 'Tab',
        });
        expect(firstSortable === test.shadowRoot?.activeElement).to.be.true;

        await sendKeys({
            press: 'Tab',
        });
        expect(secondSortable === test.shadowRoot?.activeElement).to.be.true;
    });

    it('does not tab stop on non-sortable `<sp-table-head-cell>`s', async () => {
        const input = document.createElement('input');
        const test = await fixture<HTMLElement>(virtualized());
        const el = test.shadowRoot?.querySelector('sp-table') as Table;

        test.insertAdjacentElement('beforebegin', input);

        input.focus();
        expect(input === document.activeElement).to.be.true;

        const firstHeadCell = el.querySelector(
            'sp-table-head-cell:nth-of-type(1)'
        ) as TableHeadCell;
        const secondHeadCell = el.querySelector(
            'sp-table-head-cell:nth-of-type(2)'
        ) as TableHeadCell;
        const thirdHeadCell = el.querySelector(
            'sp-table-head-cell:nth-of-type(3)'
        ) as TableHeadCell;

        await sendKeys({
            press: 'Tab',
        });
        expect(firstHeadCell === test.shadowRoot?.activeElement).to.be.true;

        await sendKeys({
            press: 'Tab',
        });
        expect(secondHeadCell === test.shadowRoot?.activeElement).to.be.true;

        await sendKeys({
            press: 'Tab',
        });
        expect(thirdHeadCell === test.shadowRoot?.activeElement).to.be.false;
        // Passes on firefox only, not sure why... Scrollable content should
        // recieve tabstop. TableBody should be scrollable.
        // expect(tableBody === test.shadowRoot?.activeElement).to.be.true;
    });

    it('can be focus()ed from the `<sp-table>`', async () => {
        const input = document.createElement('input');
        const test = await fixture<HTMLElement>(virtualized());
        const el = test.shadowRoot?.querySelector('sp-table') as Table;

        test.insertAdjacentElement('beforebegin', input);
        // we should be able to do el.focus()
        el.focus();
        // should focus the first sortable descendant
        const firstSortable = el.querySelector(
            '[sortable]:nth-of-type(1)'
        ) as TableHeadCell;

        expect(firstSortable === test.shadowRoot?.activeElement).to.be.true;
    });

    it('dispatches `change` events', async () => {
        const changeSpy = spy();
        const el = await fixture<Table>(html`
            <sp-table
                size="m"
                selects="multiple"
                .selected=${['row1', 'row2']}
                @change=${({ target }: Event & { target: Table }) => {
                    changeSpy(target);
                }}
            >
                <sp-table-head>
                    <sp-table-head-cell sortable sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable>
                        Column Title
                    </sp-table-head-cell>
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
            <div>Selected:</div>
        `);
        const rowThreeCheckboxCell = el.querySelector(
            '[value="row3"] sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        const tableHeadCheckboxCell = el.querySelector(
            'sp-table-head sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        expect(el.selected).to.deep.equal(['row1', 'row2']);

        rowThreeCheckboxCell.checkbox.click();

        expect(el.selected).to.deep.equal(['row1', 'row2', 'row3']);
        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledWithExactly(el)).to.be.true;

        tableHeadCheckboxCell.checkbox.click();

        expect(el.selected).to.deep.equal([
            'row1',
            'row2',
            'row3',
            'row4',
            'row5',
        ]);
        expect(changeSpy.callCount).to.equal(2);
        expect(changeSpy.calledWithExactly(el)).to.be.true;
    });

    it('accepts change events on TableHead `<sp-table-checkbox-cell>`', async () => {
        const changeSpy = spy();
        const el = await fixture<Table>(html`
            <sp-table
                size="m"
                selects="multiple"
                .selected=${['row1', 'row2']}
                @change=${({ target }: Event & { target: Table }) => {
                    changeSpy(target);
                }}
            >
                <sp-table-head>
                    <sp-table-head-cell sortable sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable>
                        Column Title
                    </sp-table-head-cell>
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
            <div>Selected:</div>
        `);
        const tableHeadCheckboxCell = el.querySelector(
            'sp-table-head sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        expect(el.selected).to.deep.equal(['row1', 'row2']);

        tableHeadCheckboxCell.checkbox.click();

        expect(changeSpy.calledOnce).to.be.true;
        expect(changeSpy.calledWithExactly(el)).to.be.true;

        expect(el.selected).to.deep.equal([
            'row1',
            'row2',
            'row3',
            'row4',
            'row5',
        ]);
    });

    it('accepts `rangeChanged` events on Virtualized Table', async () => {
        const changeSpy = spy();
        const virtualItems = makeItemsTwo(50);

        const el = await fixture<Table>(html`
            <sp-table
                selects="multiple"
                .selected=${['1', '47']}
                style="height: 120px"
                .items=${virtualItems}
                .renderItem=${renderItem}
                scroller?="true"
                @rangeChanged=${({ target }: Event & { target: Table }) => {
                    changeSpy(target);
                }}
            >
                <sp-table-head>
                    <sp-table-head-cell sortable sortby="name" sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
            </sp-table>
        `);

        expect(el.selected).to.deep.equal(['1', '47']);

        el.scrollToIndex(47);

        await nextFrame();
        await nextFrame();
        await elementUpdated(el);

        // What am I testing for?
        expect(changeSpy.calledWithExactly(el)).to.be.true;
    });

    xit('accepts `visibilityChanged` events on Virtualized Table', async () => {
        const changeSpy = spy();
        const virtualItems = makeItemsTwo(50);

        const el = await fixture<Table>(html`
            <sp-table
                selects="multiple"
                .selected=${['1', '47']}
                style="height: 120px"
                .items=${virtualItems}
                .renderItem=${renderItem}
                scroller?="true"
                @visibilityChanged=${({
                    target,
                }: Event & { target: Table }) => {
                    changeSpy(target);
                }}
            >
                <sp-table-head>
                    <sp-table-head-cell sortable sortby="name" sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
            </sp-table>
        `);

        expect(el.selected).to.deep.equal(['1', '47']);

        el.scrollToIndex(47);

        await nextFrame();
        await nextFrame();
        await elementUpdated(el);

        // What am I testing for?
        expect(changeSpy.calledWithExactly(el)).to.be.true;
    });

    it('validates `value` property to make sure it matches the values in `selected`', async () => {
        const el = await fixture<Table>(
            virtualizedCustomValue(virtualizedCustomValue.args as Properties)
        );

        expect(el.selected).to.deep.equal(['applied-47']);
    });

    it('surfaces [selects="single"] selection', async () => {
        const el = await fixture<Table>(selectsSingle());

        expect(el.selected, "'Row 1 selected").to.deep.equal(['row1']);
    });

    it('surfaces [selects="single"] selection on Virtualized Table', async () => {
        // TODO fix the args
        const el = await fixture<Table>(
            virtualizedSingle(virtualizedSingle.args as Properties)
        );

        expect(el.selected, "'Row 1 selected").to.deep.equal(['0']);
    });

    it('surfaces [selects="multiple"] selection', async () => {
        const el = await fixture<Table>(selectsMultiple());

        expect(el.selected, 'Rows 1 and 2 selected').to.deep.equal([
            'row1',
            'row2',
        ]);
    });

    it('surfaces [selects="multiple"] selection on Virtualized Table', async () => {
        const el = await fixture<Table>(
            virtualizedMultiple(virtualizedMultiple.args as Properties)
        );

        expect(el.selected, 'Rows 1 and 2 selected').to.deep.equal(['0', '48']);
    });

    it('selects a user-passed value for .selected array with no [selects="single"] specified, but does not allow interaction afterwards', async () => {
        const el = await fixture<Table>(html`
            <sp-table size="m" .selected=${['row3']}>
                <sp-table-head>
                    <sp-table-head-cell sortable sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
                <sp-table-body style="height: 120px">
                    <sp-table-row value="row1" class="row1">
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                    </sp-table-row>
                    <sp-table-row value="row2" class="row2">
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                    </sp-table-row>
                    <sp-table-row value="row3" class="row3">
                        <sp-table-cell>Row Item Charlie</sp-table-cell>
                        <sp-table-cell>Row Item Charlie</sp-table-cell>
                        <sp-table-cell>Row Item Charlie</sp-table-cell>
                    </sp-table-row>
                </sp-table-body>
            </sp-table>
        `);
        await elementUpdated(el);

        expect(el.selected.length).to.equal(1);

        const rowThree = el.querySelector('.row3') as TableRow;
        const rowTwo = el.querySelector('.row2') as TableRow;
        const rowTwoCheckbox = rowTwo.querySelector('sp-table-checkbox-cell');

        expect(rowThree.selected, 'third row selected').to.be.true;
        expect(rowTwo.selected, 'second row selected').to.be.false;
        expect(rowTwoCheckbox).to.be.null;
    });

    it('selects a user-passed value for .selected array with no [selects="single"] specified on Virtualized `<sp-table>`, but does not allow interaction afterwards', async () => {
        const virtualItems = makeItemsTwo(50);

        const el = await fixture<Table>(html`
            <sp-table
                .selected=${['0']}
                style="height: 120px"
                .items=${virtualItems}
                .renderItem=${renderItem}
                scroller?="true"
            >
                <sp-table-head>
                    <sp-table-head-cell sortable sortby="name" sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
            </sp-table>
        `);
        expect(el.selected.length).to.equal(1);

        await oneEvent(el, 'rangeChanged');
        await elementUpdated(el);

        const rowOneItem = el.querySelector('[value="0"]') as TableRow;
        expect(rowOneItem.value).to.equal('0');
    });

    it('selects user-passed values for .selected array with no [selects="multiple"] specified, but does not allow interaction afterwards', async () => {
        const el = await fixture<Table>(html`
            <sp-table size="m" .selected=${['row2', 'row3']}>
                <sp-table-head>
                    <sp-table-head-cell sortable sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
                <sp-table-body style="height: 120px">
                    <sp-table-row value="row1" class="row1">
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                    </sp-table-row>
                    <sp-table-row value="row2" class="row2">
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                    </sp-table-row>
                    <sp-table-row value="row3" class="row3">
                        <sp-table-cell>Row Item Charlie</sp-table-cell>
                        <sp-table-cell>Row Item Charlie</sp-table-cell>
                        <sp-table-cell>Row Item Charlie</sp-table-cell>
                    </sp-table-row>
                </sp-table-body>
            </sp-table>
        `);
        await elementUpdated(el);

        expect(el.selected.length).to.equal(2);

        const rowThree = el.querySelector('.row3') as TableRow;
        const rowTwo = el.querySelector('.row2') as TableRow;
        const rowOne = el.querySelector('.row1') as TableRow;
        const rowOneCheckbox = rowOne.querySelector('sp-table-checkbox-cell');

        expect(rowThree.selected, 'third row selected').to.be.true;
        expect(rowTwo.selected, 'second row selected').to.be.true;
        expect(rowOne.selected, 'first row selected').to.be.false;
        expect(rowOneCheckbox).to.be.null;
    });

    it('selects user-passed values for .selected array with no [selects="multiple"] specified on Virtualized `<sp-table>`, but does not allow interaction afterwards', async () => {
        const virtualItems = makeItemsTwo(5);

        const el = await fixture<Table>(html`
            <sp-table
                .selected=${['0', '4']}
                style="height: 120px"
                .items=${virtualItems}
                .renderItem=${renderItem}
                scroller?="true"
            >
                <sp-table-head>
                    <sp-table-head-cell sortable sortby="name" sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
            </sp-table>
        `);

        await oneEvent(el, 'rangeChanged');
        await elementUpdated(el);
        expect(el.selected.length).to.equal(2);

        const rowOneItem = el.querySelector('[value="0"]') as TableRow;
        const rowFiveItem = el.querySelector('[value="4"]') as TableRow;

        expect(rowOneItem.value).to.equal('0');
        expect(rowFiveItem.value).to.equal('4');
    });

    it('selects via `click` while [selects="single"]', async () => {
        const el = await fixture<Table>(html`
            <sp-table size="m" selects="single">
                <sp-table-head>
                    <sp-table-head-cell sortable sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable>
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
                <sp-table-body style="height: 120px">
                    <sp-table-row value="row1">
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                    </sp-table-row>
                    <sp-table-row value="row2" class="row2">
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                    </sp-table-row>
                    <sp-table-row value="row3" class="row3">
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
        `);
        const rowTwo = el.querySelector('.row2') as TableRow;
        const rowTwoCheckbox = rowTwo.querySelector(
            'sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        await elementUpdated(el);
        expect(el.selected.length).to.equal(0);

        rowTwoCheckbox.checkbox.click();
        await elementUpdated(el);

        expect(rowTwoCheckbox.checked).to.be.true;
        expect(el.selected).to.deep.equal(['row2']);
    });

    it('selects via `click` while  [selects="multiple"] selection', async () => {
        const el = await fixture<Table>(html`
            <sp-table size="m" selects="multiple">
                <sp-table-head>
                    <sp-table-head-cell sortable sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable>
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
                <sp-table-body style="height: 120px">
                    <sp-table-row value="row1">
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                    </sp-table-row>
                    <sp-table-row value="row2" class="row2">
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                        <sp-table-cell>Row Item Bravo</sp-table-cell>
                    </sp-table-row>
                    <sp-table-row value="row3" class="row3">
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
        `);
        const rowTwo = el.querySelector('.row2') as TableRow;
        const tableHeadCheckboxCell = el.querySelector(
            'sp-table-head sp-table-checkbox-cell'
        ) as TableCheckboxCell;
        const rowTwoCheckbox = rowTwo.querySelector(
            'sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        await elementUpdated(el);
        expect(el.selected.length).to.equal(0);

        rowTwoCheckbox.checkbox.click();
        await elementUpdated(el);

        expect(rowTwoCheckbox.checked).to.be.true;
        expect(el.selected).to.deep.equal(['row2']);

        tableHeadCheckboxCell.checkbox.click();
        await elementUpdated(el);

        expect(el.selected).to.deep.equal([
            'row2',
            'row1',
            'row3',
            'row4',
            'row5',
        ]);
    });

    it('allows [selects] to be changed by the application', async () => {
        const el = await fixture<Table>(html`
            <sp-table size="m">
                <sp-table-head>
                    <sp-table-head-cell sortable sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable>
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
                <sp-table-body style="height: 120px">
                    <sp-table-row value="row1" class="row1">
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                    </sp-table-row>
                    <sp-table-row value="row2" class="row2">
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
        `);

        expect(el.selects).to.be.undefined;

        el.selects = 'single';

        await elementUpdated(el);
        expect(el.selects).to.equal('single');

        await elementUpdated(el);
        await nextFrame();
        await nextFrame();

        const rowTwoCheckboxCell = el.querySelector(
            '.row2 sp-table-checkbox-cell'
        ) as TableCheckboxCell;
        const rowOneCheckboxCell = el.querySelector(
            '.row1 sp-table-checkbox-cell'
        ) as TableCheckboxCell;
        const tableHeadCheckboxCell = el.querySelector(
            'sp-table-head sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        expect(tableHeadCheckboxCell.selectsSingle).to.be.true;

        rowOneCheckboxCell.checkbox.click();
        await elementUpdated(el);

        expect(el.selected).to.deep.equal(['row1']);
        expect(rowOneCheckboxCell.checkbox.checked).to.be.true;
        expect(rowTwoCheckboxCell.checkbox.checked).to.be.false;

        el.selects = 'multiple';
        await elementUpdated(el);

        expect(el.selects).to.equal('multiple');
        expect(tableHeadCheckboxCell.indeterminate).to.be.true;

        rowTwoCheckboxCell.checkbox.click();

        await elementUpdated(el);
        await elementUpdated(rowTwoCheckboxCell);

        expect(el.selected).to.deep.equal(['row1', 'row2']);
        expect(rowOneCheckboxCell.checkbox.checked).to.be.true;
        expect(rowTwoCheckboxCell.checkbox.checked).to.be.true;
        expect(tableHeadCheckboxCell.indeterminate).to.be.true;
    });

    it('allows .selected values to be changed by the application when [selects="multiple"]', async () => {
        const el = await fixture<Table>(html`
            <sp-table size="m" selects="multiple" .selected=${['row1']}>
                <sp-table-head>
                    <sp-table-head-cell sortable sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell sortable>
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
                <sp-table-body style="height: 120px">
                    <sp-table-row value="row1" class="row1">
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                        <sp-table-cell>Row Item Alpha</sp-table-cell>
                    </sp-table-row>
                    <sp-table-row value="row2" class="row2">
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
        `);
        await elementUpdated(el);

        const rowTwoCheckboxCell = el.querySelector(
            '.row2 sp-table-checkbox-cell'
        ) as TableCheckboxCell;
        const rowOneCheckboxCell = el.querySelector(
            '.row1 sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        expect(el.selected).to.deep.equal(['row1']);
        expect(rowOneCheckboxCell.checkbox.checked).to.be.true;
        expect(rowTwoCheckboxCell.checkbox.checked).to.be.false;

        el.selected = ['row1', 'row2'];

        await elementUpdated(el);
        await elementUpdated(rowTwoCheckboxCell);

        expect(el.selected).to.deep.equal(['row1', 'row2']);
        expect(rowOneCheckboxCell.checkbox.checked).to.be.true;
        expect(rowTwoCheckboxCell.checkbox.checked).to.be.true;
    });

    it('ensures that virtualized elements with values in .selected are visually selected when brought into view using scrollTop', async () => {
        const virtualItems = makeItemsTwo(50);

        const el = await fixture<Table>(html`
            <sp-table
                selects="multiple"
                .selected=${['1', '47']}
                style="height: 120px"
                .items=${virtualItems}
                .renderItem=${renderItem}
                scroller?="true"
            >
                <sp-table-head>
                    <sp-table-head-cell sortable sortby="name" sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
            </sp-table>
        `);

        await oneEvent(el, 'rangeChanged');
        await elementUpdated(el);

        const rowOne = el.querySelector('[value="1"]') as TableRow;
        const rowOneCheckboxCell = rowOne.querySelector(
            'sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        expect(el.selected).to.deep.equal(['1', '47']);
        expect(rowOne.selected).to.be.true;
        expect(rowOneCheckboxCell.checkbox.checked).to.be.true;

        el.scrollTop = el.scrollHeight;

        await nextFrame();
        await nextFrame();
        await elementUpdated(el);

        const unseenRow = el.querySelector('[value="47"]') as TableRow;
        const unseenRowCheckboxCell = unseenRow.querySelector(
            'sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        expect(unseenRow.selected).to.be.true;
        expect(unseenRowCheckboxCell.checkbox.checked).to.be.true;
    });

    it('ensures that virtualized elements with values in .selected are visually selected when brought into view using scrollToIndex', async () => {
        const virtualItems = makeItemsTwo(50);
        const el = await fixture<Table>(html`
            <sp-table
                selects="multiple"
                .selected=${['1', '47']}
                style="height: 120px"
                .items=${virtualItems}
                .renderItem=${renderItem}
                scroller?="true"
            >
                <sp-table-head>
                    <sp-table-head-cell sortable sortby="name" sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
            </sp-table>
        `);

        await elementUpdated(el);
        await oneEvent(el, 'rangeChanged');
        await elementUpdated(el);

        const rowOne = el.querySelector('[value="1"]') as TableRow;
        const rowOneCheckboxCell = rowOne.querySelector(
            'sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        expect(el.selected).to.deep.equal(['1', '47']);
        expect(rowOne.selected).to.be.true;
        expect(rowOneCheckboxCell.checkbox.checked).to.be.true;

        el.scrollToIndex(47);

        await nextFrame();
        await nextFrame();
        await elementUpdated(el);

        const unseenRow = el.querySelector('[value="47"]') as TableRow;
        const unseenRowCheckboxCell = unseenRow.querySelector(
            'sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        expect(unseenRow.selected).to.be.true;
        expect(unseenRowCheckboxCell.checkbox.checked).to.be.true;
    });

    it('does not set `allSelected` to true by default on Virtualised `<sp-table>`', async () => {
        const virtualItems = makeItemsTwo(50);
        const el = await fixture<Table>(html`
            <sp-table
                selects="multiple"
                style="height: 120px"
                .selected=${['1', '47']}
                .items=${virtualItems}
                .renderItem=${renderItem}
                scroller?="true"
            >
                <sp-table-head>
                    <sp-table-head-cell sortable sortby="name" sorted="desc">
                        Column Title
                    </sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                    <sp-table-head-cell>Column Title</sp-table-head-cell>
                </sp-table-head>
            </sp-table>
        `);

        await elementUpdated(el);

        const tableHeadCheckboxCell = el.querySelector(
            'sp-table-head sp-table-checkbox-cell'
        ) as TableCheckboxCell;

        expect(el.selected).to.deep.equal(['1', '47']);
        expect(tableHeadCheckboxCell.checkbox.checked).to.be.false;
        expect(tableHeadCheckboxCell.checkbox.indeterminate).to.be.true;
    });
});
