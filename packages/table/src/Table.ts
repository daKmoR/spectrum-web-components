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
import { TableBody } from './TableBody.js';
import { TableCheckboxCell } from './TableCheckboxCell.js';
import { TableHead } from './TableHead.js';
import type { TableHeadCell } from './TableHeadCell.js';
import { TableRow } from './TableRow.js';

/**
 * @element sp-table
 */

export class Table extends SpectrumElement {
    public static override get styles(): CSSResultArray {
        return [styles];
    }

    @property({ reflect: true })
    public role = 'grid';

    @property({ type: String, reflect: true })
    public selects: undefined | 'single' | 'multiple';

    @property({ type: Array })
    public selected: string[] = [];

    private selectedSet = new Set<string>();

    protected get tableBody(): TableBody {
        return this.querySelector('sp-table-body') as TableBody;
    }

    private tableHeadCheckboxCell?: TableCheckboxCell;

    private get isVirtualized(): boolean {
        return !!this.tableBody.items.length;
    }

    public override focus(): void {
        const sortableHeadCell = this.querySelector(
            'sp-table-head-cell[sortable]'
        ) as TableHeadCell;
        if (sortableHeadCell) {
            sortableHeadCell.focus();
        }
    }

    private selectAllRows(): void {
        if (this.isVirtualized) {
            this.tableBody.items.forEach((item, index: number) => {
                this.selectedSet.add(this.tableBody.itemValue(item, index));
            });
            this.selected = [...this.selectedSet];
            this.tableBody.selected = this.selected;
        } else {
            const tableRows = [
                ...this.querySelectorAll('sp-table-row'),
            ] as TableRow[];
            tableRows.forEach((row) => {
                row.selected = true; // Visually
                this.selectedSet.add(row.value); // Prepares table state
            });
            this.selected = [...this.selectedSet];
        }

        if (!this.tableHeadCheckboxCell) return;
        this.tableHeadCheckboxCell.checked = true;
        this.tableHeadCheckboxCell.indeterminate = false;
    }

    private deselectAllRows(): void {
        this.selectedSet.clear();
        this.selected = [];

        if (this.isVirtualized) {
            this.tableBody.selected = this.selected;
        } else {
            const selectedRows = [
                ...this.querySelectorAll('[selected]'),
            ] as TableRow[];

            selectedRows.forEach((row) => {
                row.selected = false;
            });
        }

        if (!this.tableHeadCheckboxCell) return;
        this.tableHeadCheckboxCell.checked = false;
        this.tableHeadCheckboxCell.indeterminate = false;
    }

    protected manageSelects(): void {
        this.tableBody.selects = this.selects;

        if (!!this.selects) {
            let allSelected = false;
            if (this.isVirtualized) {
                allSelected =
                    this.selected.length === this.tableBody.items.length;
            } else {
                const tableRows = [
                    ...this.querySelectorAll('sp-table-row'),
                ] as TableRow[];

                tableRows.forEach((row) => {
                    row.selected = this.selectedSet.has(row.value);
                });

                allSelected = this.selected.length === tableRows.length;
            }
            if (this.tableHeadCheckboxCell) {
                this.tableHeadCheckboxCell.selectsSingle =
                    this.selects === 'single';
                this.tableHeadCheckboxCell.checked = allSelected;
                this.tableHeadCheckboxCell.indeterminate =
                    this.selected.length > 0 && !allSelected;
            }
        } else {
            const checkboxes = this.querySelectorAll('sp-table-checkbox-cell');
            checkboxes.forEach((box) => {
                box.remove();
            });
        }
    }

    // draws checkboxes on first paint
    protected manageCheckboxes(): void {
        const tableRows = [
            ...this.querySelectorAll('sp-table-row'),
        ] as TableRow[];
        const tableHead = this.querySelector('sp-table-head') as TableHead;

        if (!!this.selects) {
            this.tableHeadCheckboxCell = document.createElement(
                'sp-table-checkbox-cell'
            );
            const allSelected = this.selected.length === tableRows.length;

            if (this.tableHeadCheckboxCell) {
                this.tableHeadCheckboxCell.selectsSingle =
                    this.selects === 'single';
                this.tableHeadCheckboxCell.checked = allSelected;
                this.tableHeadCheckboxCell.indeterminate =
                    this.selected.length > 0 && !allSelected;
            }

            tableHead.insertAdjacentElement(
                'afterbegin',
                this.tableHeadCheckboxCell
            );

            tableRows.forEach((row) => {
                const checkbox = document.createElement(
                    'sp-table-checkbox-cell'
                );
                row.insertAdjacentElement('afterbegin', checkbox);
                row.selected = this.selectedSet.has(row.value);
                checkbox.checked = row.selected;
            });
        } else {
            tableHead.querySelector('sp-table-checkbox-cell')?.remove();
            tableRows.forEach((row) => {
                row.checkboxCells[0]?.remove();
                if (this.selected.length) {
                    row.selected = this.selectedSet.has(row.value);
                }
            });
        }
    }

    protected handleChange(event: Event): void {
        // Contain the children's change events and convert it to a change event on the table
        // if rowItem doesn't have a value, we assume it's in TableHead (naive!!!)
        const { target } = event;
        const { parentElement: rowItem } = target as HTMLElement & {
            parentElement: TableRow;
        };
        if (!rowItem.value) {
            const { checkbox } = target as TableCheckboxCell;
            if (checkbox.checked || checkbox.indeterminate) {
                this.selectAllRows();
            } else {
                this.deselectAllRows();
            }
        } else {
            switch (this.selects) {
                case 'single': {
                    this.deselectAllRows();
                    if (rowItem.selected) {
                        this.selectedSet.add(rowItem.value);
                        this.selected = [...this.selectedSet];
                    }
                    break;
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

                    const tableRows = [
                        ...this.querySelectorAll('sp-table-row'),
                    ] as TableRow[];

                    const allSelected =
                        this.selected.length === tableRows.length;

                    if (!this.tableHeadCheckboxCell) return;
                    this.tableHeadCheckboxCell.checked = allSelected;
                    this.tableHeadCheckboxCell.indeterminate =
                        this.selected.length > 0 && !allSelected;
                    break;
                }
                default: {
                    break;
                }
            }
            this.tableBody.selected = this.selected;
        }
        event.stopPropagation();
        this.dispatchEvent(
            new Event('change', {
                cancelable: true,
                bubbles: true,
                composed: true,
            })
        );
    }

    protected override render(): TemplateResult {
        return html`
            <slot @change=${this.handleChange}></slot>
        `;
    }

    protected override willUpdate(changed: PropertyValues<this>): void {
        if (!this.hasUpdated) {
            const rowValues = new Set<string>();

            if (this.isVirtualized) {
                this.tableBody.items.forEach((item, index) => {
                    const value = this.tableBody.itemValue(item, index);
                    rowValues.add(value);
                });
            } else {
                const tableRows = [
                    ...this.querySelectorAll('sp-table-row'),
                ] as TableRow[];
                tableRows.forEach((row) => {
                    rowValues.add(row.value);
                });
            }

            const oldSelectedCount = this.selected.length;

            this.selected = this.selected.filter((selectedItem) =>
                rowValues.has(selectedItem)
            );
            if (oldSelectedCount !== this.selected.length) {
                this.dispatchEvent(
                    new Event('change', {
                        cancelable: true,
                        bubbles: true,
                        composed: true,
                    })
                );
            }
            this.selectedSet = new Set(this.selected);
            this.tableBody.selected = this.selected;

            this.manageCheckboxes();
        }
        if (changed.has('selects')) {
            this.manageSelects();
        }
    }
}
