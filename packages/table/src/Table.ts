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
import { TableCheckboxCell } from './TableCheckboxCell.js';
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

    private selectRows(): void {
        const tableRows = [
            ...this.querySelectorAll('sp-table-row'),
        ] as TableRow[];
        tableRows.forEach((row) => {
            row.selected = true; // Visually
            this.selectedSet.add(row.value); // Prepares table state
        });
        this.selected = [...this.selectedSet];

        const tableHeadCheckbox = this.querySelector(
            'sp-table-head sp-table-checkbox-cell'
        ) as TableCheckboxCell;
        tableHeadCheckbox.checked = true;
        tableHeadCheckbox.indeterminate = false;
    }

    private deselectRows(): void {
        const selectedRows = [
            ...this.querySelectorAll('[selected]'),
        ] as TableRow[];

        selectedRows.forEach((row) => {
            row.selected = false;
        });

        this.selectedSet.clear();
        this.selected = [];

        const tableHeadCheckbox = this.querySelector(
            'sp-table-head sp-table-checkbox-cell'
        ) as TableCheckboxCell;
        tableHeadCheckbox.checked = false;
        tableHeadCheckbox.indeterminate = false;
    }

    // We create/delete checkbox cells here.
    protected manageSelects(): void {
        // add or delete checkboxes
        if (!!this.selects) {
            const tableHead = this.querySelector('sp-table-head') as TableHead;
            const tableRows = [
                ...this.querySelectorAll('sp-table-row'),
            ] as TableRow[];

            const tableHeadCheckbox = document.createElement(
                'sp-table-checkbox-cell'
            );
            const rows = this.querySelectorAll(
                'sp-table-row'
            ) as NodeListOf<TableRow>;
            const allSelected = this.selected.length === rows.length;
            tableHeadCheckbox.selectsSingle = this.selects === 'single';
            tableHeadCheckbox.checked = allSelected;
            tableHeadCheckbox.indeterminate =
                this.selected.length > 0 && !allSelected;
            tableHead.insertAdjacentElement('afterbegin', tableHeadCheckbox);

            tableRows.forEach((row) => {
                const checkbox = document.createElement(
                    'sp-table-checkbox-cell'
                );
                row.insertAdjacentElement('afterbegin', checkbox);

                row.selected = this.selectedSet.has(row.value);
                checkbox.checked = row.selected;
            });
        } else {
            const checkboxes = this.querySelectorAll('sp-table-checkbox-cell');
            checkboxes.forEach((box) => {
                box.remove();
            });
        }
    }

    protected handleChange(event: Event): void {
        // if rowItem doesn't have a value, we assume it's in TableHead (naive!!!)
        const { target } = event;
        const { parentElement: rowItem } = target as HTMLElement & {
            parentElement: TableRow;
        };
        if (!rowItem.value) {
            // no value means it's TableHead's checkbox
            const { checkbox } = target as TableCheckboxCell;
            if (checkbox.checked || checkbox.indeterminate) {
                this.selectRows();
            } else {
                this.deselectRows();
            }
            return;
        }
        // Condition the row's value into the selected array
        switch (this.selects) {
            case 'single': {
                this.deselectRows();
                if (rowItem.selected) {
                    this.selectedSet.add(rowItem.value);
                    this.selected = [...this.selectedSet];
                }
                // if you have multiple selected, but selects='single',
                // we deselect all cells? hmm...
                // EXAMPLE: rows 1, 2, 4 are selected but selects is single.
                // we deselect 2 => 1 and 4 are STILL SELECTED. if you want
                // to select any item, it's going to deselect all the cells before
                // reselecting the cell you just clicked on, as seen above.
            }
            case 'multiple': {
                if (rowItem.selected) {
                    this.selectedSet.add(rowItem.value);
                } else {
                    this.selectedSet.delete(rowItem.value);
                }
                this.selected = [...this.selectedSet];

                const tableHeadCheckbox = this.querySelector(
                    'sp-table-head sp-table-checkbox-cell'
                ) as TableCheckboxCell;
                const checkboxes = this.querySelectorAll(
                    'sp-table-body sp-table-checkbox-cell'
                ) as NodeListOf<TableCheckboxCell>;
                const allSelected = this.selected.length === checkboxes.length;
                tableHeadCheckbox.checked = allSelected;
                tableHeadCheckbox.indeterminate =
                    this.selected.length > 0 && !allSelected;
                break;
            }
            default: {
                break;
            }
        }
    }

    protected render(): TemplateResult {
        return html`
            <slot @change=${this.handleChange}></slot>
        `;
    }

    protected firstUpdated(changes: PropertyValues<this>): void {
        super.firstUpdated(changes);

        this.shadowRoot.addEventListener('change', (event: Event) => {
            event.stopPropagation();
            const target = event.target as TableCheckboxCell;
            const { parentElement: rowItem } = target as TableCheckboxCell & {
                parentElement: TableRow;
            };

            if (rowItem.selected) {
                this.selectedSet.add(rowItem.value);
                this.dispatchEvent(
                    new Event('change', {
                        cancelable: true,
                        bubbles: true,
                        composed: true,
                    })
                );
            }
            this.selected = [...this.selectedSet];
        });
    }

    protected willUpdate(changed: PropertyValues<this>): void {
        if (!this.hasUpdated) {
            this.selectedSet = new Set(this.selected);
        }
        if (changed.has('selects')) {
            this.manageSelects();
        }
    }
}
