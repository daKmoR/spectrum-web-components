/* TABLE
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
    CSSResultArray,
    html,
    PropertyValues,
    SpectrumElement,
    TemplateResult,
} from '@spectrum-web-components/base';
import { property } from '@spectrum-web-components/base/src/decorators.js';

import styles from './table.css.js';
import { TableHead } from './TableHead.js';
import type { TableHeadCell } from './TableHeadCell.js';
import { TableRow } from './TableRow.js';

/**
 * @element sp-table
 */

export class Table extends SpectrumElement {
    public static get styles(): CSSResultArray {
        return [styles];
    }

    @property({ reflect: true })
    public role = 'grid';

    @property({ type: String, reflect: true })
    public selects: undefined | 'single' | 'multiple';

    @property({ type: Array })
    public selected: string[] = [];

    private selectedSet = new Set<string>();

    public focus(): void {
        const sortableHeadCell = this.querySelector(
            'sp-table-head-cell[sortable]'
        ) as TableHeadCell;
        if (sortableHeadCell) {
            sortableHeadCell.focus();
        }
    }

    // private deselectCells(): void {
    //     const selectedRows = [
    //         ...this.querySelectorAll('[selected]'),
    //     ] as TableRow[];

    //     selectedRows.forEach((row) => {
    //         row.selected = false;
    //         row.tabIndex = -1;
    //         row.setAttribute('aria-checked', 'false');
    //     });

    //     // TODO: handle selection/deselection for tableHead Checkbox, too
    // }

    // We create/delete checkbox cells here.
    protected handleSelects(): void {
        // add or delete checkboxes
        if (this.selects) {
            const tableHead = this.querySelector('sp-table-head') as TableHead;
            const tableRows = [
                ...this.querySelectorAll('sp-table-row'),
            ] as TableRow[];

            tableHead.insertAdjacentElement(
                'afterbegin',
                document.createElement('sp-table-checkbox-cell')
            );
            tableRows.forEach((row) => {
                row.insertAdjacentElement(
                    'afterbegin',
                    document.createElement('sp-table-checkbox-cell')
                );
                row.selected = this.selectedSet.has(row.value);
            });
        } else {
            const checkboxes = this.querySelectorAll('sp-table-checkbox-cell');
            checkboxes.forEach((box) => {
                box.remove();
            });
        }
    }

    // Do we handle the actual selection here?
    // What if we just listen for events happening on child elements?

    protected handleSelected(): void {
        const selectedRows = [
            ...this.querySelectorAll('sp-table-row[selected]'),
        ] as TableRow[];
        selectedRows.forEach((row) => {
            this.selected.push(row.value);
            row.selected = true;
        });
    }

    protected handleChange(event: Event): void {
        // What changed (checkbox checked/unchecked)? Where did it change?
        const { target } = event;
        const { parentElement: item } = target as HTMLElement & {
            parentElement: TableRow;
        };
        // Condition the row's value into the selected array
        if (item.selected) {
            this.selectedSet.add(item.value);
        } else {
            this.selectedSet.delete(item.value);
        }
        this.selected = [...this.selectedSet];
    }

    protected render(): TemplateResult {
        return html`
            <slot @change=${this.handleChange}></slot>
        `;
    }

    protected willUpdate(changed: PropertyValues<this>): void {
        if (!this.hasUpdated) {
            this.selectedSet = new Set(this.selected);
        }
        if (changed.has('selects')) {
            this.handleSelects();
        }
    }
}
