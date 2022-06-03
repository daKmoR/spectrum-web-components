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
    CSSResultArray,
    html,
    PropertyValues,
    SpectrumElement,
    TemplateResult,
} from '@spectrum-web-components/base';
import {
    property,
    // query,
} from '@spectrum-web-components/base/src/decorators.js';
import { Checkbox } from '@spectrum-web-components/checkbox';
import styles from './table-row.css.js';
import { TableCheckboxCell } from './TableCheckboxCell.js';

/**
 * @element sp-table
 */
export class TableRow extends SpectrumElement {
    public static override get styles(): CSSResultArray {
        return [styles];
    }

    @property({ reflect: true })
    public role = 'row';

    @property({ type: Boolean, reflect: true })
    public selected = false;

    @property({ type: String })
    public value = '';

    protected handleChange(): void {
        // get the value of "checked" from the sp-checkbox
        const checkboxCell = this.querySelector(
            'sp-table-checkbox-cell'
        ) as TableCheckboxCell;
        if (!checkboxCell) return;

        const checkbox = checkboxCell.shadowRoot.children[0] as Checkbox;
        if (!checkbox) return;

        this.selected = checkbox.checked;
    }

    protected manageSelected(): void {
        const checkboxCell = this.querySelector(
            'sp-table-checkbox-cell'
        ) as TableCheckboxCell;
        if (!checkboxCell) return;

        checkboxCell.checked = this.selected;
    }

    protected override render(): TemplateResult {
        return html`
            <slot></slot>
        `;
    }

    // I want this to listen for the change on a checkbox Cell and to update
    // its selected state accordingly.
    protected override firstUpdated(changes: PropertyValues): void {
        super.firstUpdated(changes);
        // cache a ref to checkbox cell here bc DOM is current
        this.addEventListener('change', this.handleChange);
    }

    protected override willUpdate(changed: PropertyValues<this>): void {
        if (changed.has('selected')) {
            this.manageSelected();
        }
    }
}
